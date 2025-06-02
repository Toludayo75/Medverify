import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useWebsocket } from "@/hooks/use-websocket";
import { 
  Loader2, 
  BellIcon, 
  BellOff, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MessageCircle, 
  AlarmClockCheck,
  AlertTriangle 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Define notification types for type safety
type NotificationType = 'verification' | 'report' | 'system';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  status?: string;
  nafdacNumber?: string;
  batchNumber?: string;
  productName?: string;
}

export default function NotificationsPage() {
  const { user, isLoading } = useAuth();
  const { notifications: wsNotifications, clearNotifications } = useWebsocket();
  const [activeTab, setActiveTab] = useState("all");
  const [readState, setReadState] = useState<{[key: string]: boolean}>({});

  // Load read state from localStorage on component mount
  useEffect(() => {
    const savedReadState = localStorage.getItem('notificationReadState');
    if (savedReadState) {
      try {
        setReadState(JSON.parse(savedReadState));
      } catch (error) {
        console.error('Error parsing saved read state:', error);
      }
    }
  }, []);
  
  // Save read state to localStorage when it changes
  useEffect(() => {
    if (Object.keys(readState).length > 0) {
      localStorage.setItem('notificationReadState', JSON.stringify(readState));
    }
  }, [readState]);

  // Convert WebSocket notifications to the Notification interface
  const convertedWsNotifications: Notification[] = wsNotifications.map((notification, index) => ({
    id: Date.now() - index, // Generate unique IDs based on timestamp
    type: notification.type as NotificationType,
    title: notification.title,
    message: notification.message,
    timestamp: notification.timestamp,
    isRead: readState[notification.timestamp] || false,
    status: notification.status,
    nafdacNumber: notification.nafdacNumber,
    productName: notification.productName,
    batchNumber: notification.batchNumber
  }));

  // Sample static notifications for demonstration
  const staticNotifications: Notification[] = [
    {
      id: 1,
      type: 'verification',
      title: 'New Verification',
      message: 'A user verified Paracetamol with NAFDAC Number A11-0591',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
      isRead: readState['static-1'] || false,
      nafdacNumber: 'A11-0591',
      productName: 'Paracetamol',
      status: 'genuine'
    },
    {
      id: 2,
      type: 'report',
      title: 'New Suspicious Drug Report',
      message: 'A user reported Ciprofloxacin purchased from Lagos as potentially counterfeit',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
      isRead: readState['static-2'] || false,
      productName: 'Ciprofloxacin',
      status: 'pending'
    }
  ];

  // Combine WebSocket and static notifications
  const adminNotifications: Notification[] = [...convertedWsNotifications, ...staticNotifications];
  
  // Regular users have no notifications
  const userNotifications: Notification[] = [];

  // Select notifications based on user role
  const notifications = user?.role === 'admin' ? adminNotifications : userNotifications;
  
  // Function to mark all notifications as read
  const markAllAsRead = () => {
    const newReadState = {...readState};
    
    // Mark all WebSocket notifications as read
    wsNotifications.forEach(notification => {
      newReadState[notification.timestamp] = true;
    });
    
    // Mark all static notifications as read
    staticNotifications.forEach((notification, index) => {
      newReadState[`static-${index+1}`] = true;
    });
    
    setReadState(newReadState);
  };

  // Function to format date in a readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  // Function to render status badge
  const renderStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch (status) {
      case 'genuine':
        return <Badge className="bg-green-500">Genuine</Badge>;
      case 'counterfeit':
        return <Badge className="bg-red-500">Counterfeit</Badge>;
      case 'flagged':
        return <Badge className="bg-amber-500">Flagged</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Notifications</h1>
              <p className="text-neutral-600 mt-2">
                {user?.role === 'admin' 
                  ? 'Stay updated on drug verifications, user reports, and system updates'
                  : 'Stay updated on the latest information about your verifications and reports'
                }
              </p>
            </div>
            {notifications.length > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <BellOff className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b mb-6">
              <TabsList className="bg-transparent">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  All
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <Badge className="ml-2 bg-red-500">{notifications.filter(n => !n.isRead).length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="verification" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Verifications
                  {notifications.filter(n => n.type === 'verification' && !n.isRead).length > 0 && (
                    <Badge className="ml-2 bg-red-500">{notifications.filter(n => n.type === 'verification' && !n.isRead).length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="report" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Reports
                  {notifications.filter(n => n.type === 'report' && !n.isRead).length > 0 && (
                    <Badge className="ml-2 bg-red-500">{notifications.filter(n => n.type === 'report' && !n.isRead).length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="system" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  System
                  {notifications.filter(n => n.type === 'system' && !n.isRead).length > 0 && (
                    <Badge className="ml-2 bg-red-500">{notifications.filter(n => n.type === 'system' && !n.isRead).length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="mt-0">
              {filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <Card key={notification.id} className={`transition-all ${!notification.isRead ? 'border-l-4 border-l-primary' : ''}`}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center">
                          {notification.type === 'verification' && (
                            <AlarmClockCheck className="h-5 w-5 text-blue-500 mr-2" />
                          )}
                          {notification.type === 'report' && (
                            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                          )}
                          {notification.type === 'system' && (
                            <MessageCircle className="h-5 w-5 text-neutral-500 mr-2" />
                          )}
                          <CardTitle className="text-base font-semibold">
                            {notification.title}
                            {!notification.isRead && (
                              <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                          </CardTitle>
                        </div>
                        <div className="flex items-center">
                          {notification.status && renderStatusBadge(notification.status)}
                          <span className="text-xs text-neutral-500 ml-2">
                            {new Date(notification.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-neutral-700">{notification.message}</p>
                        {notification.nafdacNumber && (
                          <div className="mt-2 pt-2 border-t text-sm">
                            <span className="text-neutral-500">NAFDAC: </span>
                            <span className="font-medium">{notification.nafdacNumber}</span>
                            {notification.batchNumber && (
                              <>
                                <span className="text-neutral-500 ml-3">Batch: </span>
                                <span className="font-medium">{notification.batchNumber}</span>
                              </>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BellIcon className="h-12 w-12 text-neutral-300 mb-4" />
                    <h3 className="text-xl font-medium text-neutral-700">No Notifications</h3>
                    <p className="text-neutral-500 text-center mt-2 max-w-md">
                      {user?.role === 'admin' 
                        ? 'You don\'t have any notifications in this category yet. When users verify drugs or submit reports, you\'ll receive updates here.'
                        : 'You don\'t have any notifications yet. When you verify drugs or submit reports, you\'ll receive updates here.'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}