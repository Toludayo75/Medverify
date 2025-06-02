import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Search, Filter, X, Clock, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Report } from "@shared/schema";

export default function MyReportsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports/user"],
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredReports = reports?.filter((report) => {
    const matchesSearch = !searchTerm || 
      (report.productName && report.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.nafdacNumber && report.nafdacNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !statusFilter || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'investigating':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Pending</Badge>;
      case 'investigating':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Investigating</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500 hover:bg-green-600">Resolved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">My Reports</h1>
              <p className="text-neutral-600 mt-2">
                Track the suspicious drug reports you've submitted
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button variant="outline" onClick={() => window.location.href = '/report'}>
                Submit New Report
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <Input
                  type="text"
                  placeholder="Search by product name or NAFDAC number..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <Filter className="h-4 w-4 text-neutral-500" />
                <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || undefined)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !reports || reports.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="p-3 rounded-full bg-neutral-100 mb-4">
                    <AlertCircle className="h-8 w-8 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-medium text-neutral-700">No Reports Found</h3>
                  <p className="text-neutral-500 text-center mt-2 max-w-md">
                    You haven't submitted any reports yet. Use the "Submit New Report" button to report a suspicious medication.
                  </p>
                  <Button 
                    className="mt-6" 
                    onClick={() => window.location.href = '/report'}
                  >
                    Submit Your First Report
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredReports?.map((report) => (
                  <Card key={report.id} className="overflow-hidden">
                    <div className={`h-1 ${
                      report.status === 'resolved' ? 'bg-green-500' : 
                      report.status === 'investigating' ? 'bg-blue-500' : 
                      report.status === 'rejected' ? 'bg-red-500' : 
                      'bg-orange-500'
                    }`} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          {getStatusIcon(report.status)}
                          <CardTitle className="ml-2 text-lg">
                            {report.productName || `Report #${report.id}`}
                          </CardTitle>
                        </div>
                        {getStatusBadge(report.status)}
                      </div>
                      <CardDescription>
                        Reported on {formatDate(report.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        {report.nafdacNumber && (
                          <div>
                            <p className="text-sm text-neutral-500">NAFDAC Number</p>
                            <p className="font-medium">{report.nafdacNumber}</p>
                          </div>
                        )}
                        {report.batchNumber && (
                          <div>
                            <p className="text-sm text-neutral-500">Batch Number</p>
                            <p className="font-medium">{report.batchNumber}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-neutral-500">Purchase Location</p>
                          <p className="font-medium">{report.purchaseLocation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Reason</p>
                          <p className="font-medium">{report.reason}</p>
                        </div>
                      </div>
                      {report.details && (
                        <div className="mt-4">
                          <p className="text-sm text-neutral-500">Additional Details</p>
                          <p className="text-sm">{report.details}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}