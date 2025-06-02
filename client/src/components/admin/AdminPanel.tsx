import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Flag, LineChart, Database, AlertTriangle, Eye, Edit, X, Ban, CheckCircle2 } from "lucide-react";
import AddDrugForm from "./AddDrugForm";

export default function AdminPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDrugDialog, setViewDrugDialog] = useState(false);
  const [viewVerificationDialog, setViewVerificationDialog] = useState(false);
  const [viewReportDialog, setViewReportDialog] = useState(false);
  const [updateReportDialog, setUpdateReportDialog] = useState(false);
  
  // Selected item states
  const [selectedDrug, setSelectedDrug] = useState<any>(null);
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reportStatus, setReportStatus] = useState<string>("");
  
  // First fetch the drugs data
  const { data: drugs, isLoading: drugsLoading } = useQuery({
    queryKey: ["/api/admin/drugs"],
    enabled: true, // Always fetch drugs data
  });
  
  // Then fetch the verifications
  const { data: verifications, isLoading: verificationsLoading } = useQuery({
    queryKey: ["/api/admin/verifications"],
    enabled: activeTab === "verifications" || activeTab === "overview",
  });
  
  // Map drug names to verifications after we have the drugs data
  const verificationsWithDrugInfo = verifications?.map((v: any) => {
    const matchingDrug = drugs?.find((drug: any) => drug.id === v.drugId);
    return {
      ...v,
      drugName: matchingDrug?.productName || 'Unknown',
      nafdacNumber: matchingDrug?.nafdacNumber || 'N/A'
    };
  });
  
  // Then fetch the reports
  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/admin/reports"],
    enabled: activeTab === "reports" || activeTab === "overview",
  });
  
  // Update drug blacklist status mutation
  const updateDrugMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const response = await apiRequest("PATCH", `/api/admin/drugs/${id}`, data);
      if (!response.ok) {
        throw new Error("Failed to update drug");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/drugs"] });
      toast({
        title: "Drug updated",
        description: "The drug has been updated successfully.",
      });
      setViewDrugDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Update report status mutation
  const updateReportMutation = useMutation({
    mutationFn: async ({ id, status, flagDrug }: { id: number, status: string, flagDrug?: boolean }) => {
      const response = await apiRequest("PATCH", `/api/admin/reports/${id}`, { status, flagDrug });
      if (!response.ok) {
        throw new Error("Failed to update report status");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/drugs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verifications"] });
      toast({
        title: "Report updated",
        description: "The report status has been updated successfully.",
      });
      setUpdateReportDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle view drug
  const handleViewDrug = (drug: any) => {
    setSelectedDrug(drug);
    setViewDrugDialog(true);
  };
  
  // Handle blacklist/unblacklist drug
  const handleBlacklistDrug = (drug: any) => {
    updateDrugMutation.mutate({
      id: drug.id,
      data: { isBlacklisted: !drug.isBlacklisted }
    });
  };
  
  // Handle view verification
  const handleViewVerification = (verification: any) => {
    setSelectedVerification(verification);
    setViewVerificationDialog(true);
  };
  
  // Handle view report
  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setViewReportDialog(true);
  };
  
  // Handle update report
  const handleUpdateReport = (report: any) => {
    setSelectedReport(report);
    setReportStatus(report.status);
    setUpdateReportDialog(true);
  };
  
  // State for managing the flag drug option
  const [flagDrug, setFlagDrug] = useState(false);
  
  // Handle submit report update
  const handleSubmitReportUpdate = () => {
    if (selectedReport && reportStatus) {
      updateReportMutation.mutate({
        id: selectedReport.id,
        status: reportStatus,
        flagDrug: flagDrug
      });
    }
  };
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "genuine":
        return <Badge className="bg-secondary">Genuine</Badge>;
      case "counterfeit":
        return <Badge className="bg-danger">Counterfeit</Badge>;
      case "flagged":
        return <Badge className="bg-warning">Flagged</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-warning-dark border-warning">Pending</Badge>;
      case "investigating":
        return <Badge className="bg-primary">Investigating</Badge>;
      case "resolved":
        return <Badge className="bg-secondary">Resolved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="text-neutral-500">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Function to close the dialog and refresh data
  const handleDialogClose = () => {
    setDialogOpen(false);
    // Refresh data
    queryClient.invalidateQueries({ queryKey: ["/api/admin/drugs"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-dark">
              <Database className="mr-2 h-4 w-4" /> Add New Drug
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[95vh] md:max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Drug</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new drug to the database.
              </DialogDescription>
            </DialogHeader>
            <AddDrugForm onSuccess={handleDialogClose} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {verificationsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : verifications?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                reports?.filter((r: any) => r.status === "pending").length || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Counterfeit Detections</CardTitle>
            <AlertTriangle className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {verificationsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/verifications"] })}
                  className="focus:outline-none hover:text-primary transition-colors"
                >
                  {verifications?.filter((v: any) => v.status === "counterfeit").length || 0}
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Potential fakes detected</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Drugs</CardTitle>
            <Flag className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {drugsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/drugs"] })}
                  className="focus:outline-none hover:text-primary transition-colors"
                >
                  {drugs?.filter((d: any) => d.status === "flagged").length || 0}
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="drugs">All Drugs</TabsTrigger>
          <TabsTrigger value="verifications">Verification Log</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                {verificationsLoading ? (
                  <div className="flex justify-center my-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Drug Name</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {verifications?.slice(0, 5).map((v: any) => {
                        const drugName = drugs?.find((d: any) => d.id === v.drugId)?.productName || 'Unknown';
                        return (
                          <TableRow key={v.id}>
                            <TableCell>{new Date(v.createdAt).toLocaleString()}</TableCell>
                            <TableCell>{drugName}</TableCell>
                            <TableCell>{renderStatusBadge(v.status)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {reportsLoading ? (
                  <div className="flex justify-center my-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports?.slice(0, 5).map((r: any) => (
                        <TableRow key={r.id}>
                          <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                          <TableCell>{r.productName}</TableCell>
                          <TableCell>{renderStatusBadge(r.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="verifications">
          <Card>
            <CardHeader>
              <CardTitle>Verification Log</CardTitle>
            </CardHeader>
            <CardContent>
              {verificationsLoading ? (
                <div className="flex justify-center my-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Drug Name</TableHead>
                      <TableHead>NAFDAC #</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verificationsWithDrugInfo?.map((v: any) => (
                      <TableRow key={v.id}>
                        <TableCell>{new Date(v.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{v.drugName}</TableCell>
                        <TableCell>{v.nafdacNumber}</TableCell>
                        <TableCell>{v.batchId || 'N/A'}</TableCell>
                        <TableCell>{v.userId || 'Anonymous'}</TableCell>
                        <TableCell>{renderStatusBadge(v.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewVerification(v)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          {/* View Verification Dialog */}
          <Dialog open={viewVerificationDialog} onOpenChange={setViewVerificationDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verification Details</DialogTitle>
              </DialogHeader>
              {selectedVerification && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Verification ID</Label>
                      <p className="mt-1">{selectedVerification.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Date & Time</Label>
                      <p className="mt-1">{new Date(selectedVerification.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Drug Name</Label>
                      <p className="mt-1">{
                        drugs?.find((d: any) => d.id === selectedVerification.drugId)?.productName || 'Unknown'
                      }</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">NAFDAC Number</Label>
                      <p className="mt-1">{
                        drugs?.find((d: any) => d.id === selectedVerification.drugId)?.nafdacNumber || 'N/A'
                      }</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Batch ID</Label>
                      <p className="mt-1">{selectedVerification.batchId || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">User ID</Label>
                      <p className="mt-1">{selectedVerification.userId || 'Anonymous'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <p className="mt-1">{renderStatusBadge(selectedVerification.status)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">IP Address</Label>
                      <p className="mt-1">{selectedVerification.ipAddress}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <p className="mt-1">{selectedVerification.location || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setViewVerificationDialog(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="drugs">
          <Card>
            <CardHeader>
              <CardTitle>Drug Database</CardTitle>
            </CardHeader>
            <CardContent>
              {drugsLoading ? (
                <div className="flex justify-center my-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NAFDAC #</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Dosage Form</TableHead>
                      <TableHead>Strength</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drugs?.map((drug: any) => (
                      <TableRow key={drug.id}>
                        <TableCell className="font-mono">{drug.nafdacNumber}</TableCell>
                        <TableCell className="font-medium">{drug.productName}</TableCell>
                        <TableCell>{drug.manufacturer}</TableCell>
                        <TableCell>{drug.dosageForm}</TableCell>
                        <TableCell>{drug.strength}</TableCell>
                        <TableCell>{renderStatusBadge(drug.status)}</TableCell>
                        <TableCell>{new Date(drug.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="space-x-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDrug(drug)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          {drug.isBlacklisted ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-secondary-light text-secondary"
                              onClick={() => handleBlacklistDrug(drug)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" /> Unblacklist
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-danger"
                              onClick={() => handleBlacklistDrug(drug)}
                            >
                              <Ban className="h-4 w-4 mr-1" /> Blacklist
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          {/* View Drug Dialog */}
          <Dialog open={viewDrugDialog} onOpenChange={setViewDrugDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Drug Details</DialogTitle>
              </DialogHeader>
              {selectedDrug && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">NAFDAC Number</Label>
                      <p className="mt-1 font-mono">{selectedDrug.nafdacNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Product Name</Label>
                      <p className="mt-1 font-medium">{selectedDrug.productName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Manufacturer</Label>
                      <p className="mt-1">{selectedDrug.manufacturer}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Dosage Form</Label>
                      <p className="mt-1">{selectedDrug.dosageForm}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Strength</Label>
                      <p className="mt-1">{selectedDrug.strength || 'Not specified'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <p className="mt-1">{renderStatusBadge(selectedDrug.status)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Blacklisted</Label>
                      <p className="mt-1">{selectedDrug.isBlacklisted ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Updated</Label>
                      <p className="mt-1">{new Date(selectedDrug.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setViewDrugDialog(false)}
                >
                  Close
                </Button>
                {selectedDrug && (
                  <Button 
                    variant={selectedDrug.isBlacklisted ? "secondary" : "destructive"}
                    onClick={() => {
                      handleBlacklistDrug(selectedDrug);
                    }}
                  >
                    {selectedDrug.isBlacklisted ? 'Unblacklist Drug' : 'Blacklist Drug'}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="flex justify-center my-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>NAFDAC #</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports?.map((r: any) => (
                      <TableRow key={r.id}>
                        <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{r.productName}</TableCell>
                        <TableCell>{r.nafdacNumber || 'N/A'}</TableCell>
                        <TableCell>{r.suspectedIssue}</TableCell>
                        <TableCell>{r.purchaseLocation || 'Not provided'}</TableCell>
                        <TableCell>{renderStatusBadge(r.status)}</TableCell>
                        <TableCell className="space-x-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewReport(r)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleUpdateReport(r)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          {/* View Report Dialog */}
          <Dialog open={viewReportDialog} onOpenChange={setViewReportDialog}>
            <DialogContent className="max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Report Details</DialogTitle>
              </DialogHeader>
              {selectedReport && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Report ID</Label>
                      <p className="mt-1">{selectedReport.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Date & Time</Label>
                      <p className="mt-1">{new Date(selectedReport.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Product Name</Label>
                      <p className="mt-1 font-medium">{selectedReport.productName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">NAFDAC Number</Label>
                      <p className="mt-1">{selectedReport.nafdacNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Batch Number</Label>
                      <p className="mt-1">{selectedReport.batchNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Purchase Location</Label>
                      <p className="mt-1">{selectedReport.purchaseLocation || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <p className="mt-1">{renderStatusBadge(selectedReport.status)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Reported by</Label>
                      <p className="mt-1">{selectedReport.isAnonymous ? 'Anonymous' : `User ID: ${selectedReport.reporterId}`}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Reason for Report</Label>
                    <p className="mt-1">{selectedReport.suspectedIssue}</p>
                  </div>
                  
                  {selectedReport.details && (
                    <div>
                      <Label className="text-sm font-medium">Additional Details</Label>
                      <p className="mt-1">{selectedReport.details}</p>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setViewReportDialog(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="default"
                  onClick={() => {
                    setViewReportDialog(false);
                    handleUpdateReport(selectedReport);
                  }}
                >
                  Update Status
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Update Report Dialog */}
          <Dialog open={updateReportDialog} onOpenChange={(open) => {
            setUpdateReportDialog(open);
            if (!open) {
              // Reset flag drug state when dialog closes
              setFlagDrug(false);
            }
          }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Report Status</DialogTitle>
                <DialogDescription>
                  Change the status of this report to track its investigation progress.
                </DialogDescription>
              </DialogHeader>
              {selectedReport && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="report-status">Status</Label>
                    <Select
                      value={reportStatus}
                      onValueChange={setReportStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Flag drug option */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="flag-drug" checked={flagDrug} onCheckedChange={(checked: boolean) => setFlagDrug(checked)} />
                    <Label htmlFor="flag-drug" className="text-sm font-medium cursor-pointer">
                      Flag this drug for review
                    </Label>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Flagging the drug will mark it as potentially problematic in the system, 
                    updating its status to "flagged" and incrementing the Flagged Drugs counter.
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex items-center space-x-2 pb-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span>Current Status: {renderStatusBadge(selectedReport.status)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-secondary" />
                      <span>New Status: {renderStatusBadge(reportStatus)}</span>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setUpdateReportDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitReportUpdate}
                  disabled={updateReportMutation.isPending || reportStatus === selectedReport?.status}
                >
                  {updateReportMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
