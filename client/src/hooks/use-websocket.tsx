import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

type WebSocketMessage = {
  type: string;
  [key: string]: any;
};

export function useWebsocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<WebSocketMessage[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Function to connect to websocket
  const connect = useCallback(() => {
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    // Create WebSocket connection using the correct protocol based on the environment
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      
      // Authenticate as admin if user is logged in and is an admin
      if (user && user.role === 'admin') {
        socket.send(JSON.stringify({
          type: 'auth',
          role: 'admin'
        }));
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        if (data.type === 'verification' || data.type === 'report') {
          // Add to notifications
          setNotifications(prev => [data, ...prev]);
          
          // Show toast notification
          toast({
            title: data.title,
            description: data.message,
            variant: data.type === 'verification' ? 
              (data.status === 'genuine' ? 'default' : 'destructive') : 
              'destructive'
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      
      // Try to reconnect after a delay
      setTimeout(() => {
        if (user && user.role === 'admin') {
          connect();
        }
      }, 3000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      socket.close();
    };
  }, [user, toast]);

  // Connect when the component mounts and when user changes
  useEffect(() => {
    if (user && user.role === 'admin') {
      connect();
      
      // Log user info for debugging
      console.log('Admin user connected to WebSocket:', user);
    } else {
      console.log('User not admin or not logged in:', user);
    }

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [user, connect]);

  // Store notifications in localStorage to persist across page refreshes
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Load notifications from localStorage on initial render
  useEffect(() => {
    const storedNotifications = localStorage.getItem('adminNotifications');
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications);
        if (Array.isArray(parsedNotifications) && parsedNotifications.length > 0) {
          setNotifications(parsedNotifications);
        }
      } catch (error) {
        console.error('Error parsing stored notifications:', error);
      }
    }
  }, []);

  // Function to manually send messages
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not connected');
    }
  }, []);

  // Function to clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    isConnected,
    notifications,
    sendMessage,
    clearNotifications
  };
}