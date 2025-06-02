import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Search, Filter, X, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Verification } from "@shared/schema";

export default function MyVerificationsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data: verifications, isLoading } = useQuery<Verification[]>({
    queryKey: ["/api/verifications/user"],
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredVerifications = verifications?.filter((verification) => {
    const matchesSearch = !searchTerm || 
      verification.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || verification.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'genuine':
        return <CheckCircle className="h-5 w-5 text-secondary" />;
      case 'counterfeit':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'flagged':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'genuine':
        return <Badge className="bg-secondary hover:bg-secondary/80">Genuine</Badge>;
      case 'counterfeit':
        return <Badge className="bg-destructive hover:bg-destructive/80">Counterfeit</Badge>;
      case 'flagged':
        return <Badge className="bg-warning hover:bg-warning/80">Flagged</Badge>;
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
              <h1 className="text-3xl font-bold text-neutral-900">My Verifications</h1>
              <p className="text-neutral-600 mt-2">
                View your history of drug verification checks
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button variant="outline" onClick={() => window.location.href = '/verify'}>
                Verify New Drug
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <Input
                  type="text"
                  placeholder="Search verifications..."
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
                    <SelectItem value="genuine">Genuine</SelectItem>
                    <SelectItem value="counterfeit">Counterfeit</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !verifications || verifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="p-3 rounded-full bg-neutral-100 mb-4">
                    <Search className="h-8 w-8 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-medium text-neutral-700">No Verifications Found</h3>
                  <p className="text-neutral-500 text-center mt-2 max-w-md">
                    You haven't verified any medications yet. Use the "Verify New Drug" button to check a medication.
                  </p>
                  <Button 
                    className="mt-6" 
                    onClick={() => window.location.href = '/verify'}
                  >
                    Verify Your First Drug
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredVerifications?.map((verification) => (
                  <Card key={verification.id} className="overflow-hidden">
                    <div className={`h-1 ${
                      verification.status === 'genuine' ? 'bg-secondary' : 
                      verification.status === 'counterfeit' ? 'bg-destructive' : 
                      'bg-warning'
                    }`} />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          {getStatusIcon(verification.status)}
                          <CardTitle className="ml-2 text-lg">
                            Verification #{verification.id}
                          </CardTitle>
                        </div>
                        {getStatusBadge(verification.status)}
                      </div>
                      <CardDescription>
                        Verified on {formatDate(verification.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        <div>
                          <p className="text-sm text-neutral-500">Drug ID</p>
                          <p className="font-medium">{verification.drugId}</p>
                        </div>
                        {verification.batchId && (
                          <div>
                            <p className="text-sm text-neutral-500">Batch ID</p>
                            <p className="font-medium">{verification.batchId}</p>
                          </div>
                        )}
                        {verification.location && (
                          <div>
                            <p className="text-sm text-neutral-500">Location</p>
                            <p className="font-medium">{verification.location}</p>
                          </div>
                        )}
                      </div>
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