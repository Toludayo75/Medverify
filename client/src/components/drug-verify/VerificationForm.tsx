import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, QrCode } from "lucide-react";
import VerificationResult from "./VerificationResult";

type VerificationResponse = {
  drug?: {
    id: number;
    nafdacNumber: string;
    productName: string;
    manufacturer: string;
    dosageForm: string;
    strength: string;
    status: "genuine" | "counterfeit" | "flagged";
    isBlacklisted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  batch?: {
    id: number;
    drugId: number;
    batchNumber: string;
    manufactureDate: string;
    expiryDate: string;
    createdAt: string;
  };
  verification: {
    id: number;
    drugId?: number;
    batchId?: number;
    userId?: number;
    status: "genuine" | "counterfeit" | "flagged";
    createdAt: string;
  };
  counterfeit?: boolean;
  nafdacNumber?: string;
  message?: string;
};

export default function VerificationForm() {
  const [nafdacNumber, setNafdacNumber] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const { toast } = useToast();

  const verifyMutation = useMutation({
    mutationFn: async (data: { nafdacNumber: string; batchNumber?: string }) => {
      try {
        const res = await apiRequest("POST", "/api/verify", data);
        return await res.json() as VerificationResponse;
      } catch (error) {
        console.error("Verification error:", error);
        throw new Error("Verification failed. Please try again.");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nafdacNumber.trim()) {
      toast({
        title: "Validation Error",
        description: "NAFDAC number is required",
        variant: "destructive",
      });
      return;
    }
    
    verifyMutation.mutate({
      nafdacNumber: nafdacNumber.trim(),
      batchNumber: batchNumber.trim() || undefined,
    });
    
    // Reset verification data on submit to show loading state again
    if (verifyMutation.data) {
      verifyMutation.reset();
    }
  };

  const handleScanBarcode = () => {
    toast({
      title: "Scan Feature",
      description: "Barcode scanning will be available in the mobile app",
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-neutral-50 rounded-xl shadow-sm p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="nafdac-number" className="block text-sm font-medium text-neutral-700">
            NAFDAC Number
          </Label>
          <div className="mt-1">
            <Input
              type="text"
              id="nafdac-number"
              value={nafdacNumber}
              onChange={(e) => setNafdacNumber(e.target.value)}
              className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-neutral-300 rounded-md p-3"
              placeholder="e.g. A1-1234"
              required
            />
          </div>
          <p className="mt-2 text-sm text-neutral-500">
            Found on medication packaging, typically beginning with letters followed by numbers
          </p>
        </div>
        
        <div>
          <Label htmlFor="batch-number" className="block text-sm font-medium text-neutral-700">
            Batch Number (Optional)
          </Label>
          <div className="mt-1">
            <Input
              type="text"
              id="batch-number"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-neutral-300 rounded-md p-3"
              placeholder="e.g. BN12345"
            />
          </div>
          <p className="mt-2 text-sm text-neutral-500">
            Provides additional verification accuracy
          </p>
        </div>
        
        <div>
          <Button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={verifyMutation.isPending}
          >
            {verifyMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
              </>
            ) : (
              "Verify Now"
            )}
          </Button>
        </div>
      </form>
      
      {verifyMutation.data && (
        <VerificationResult
          result={verifyMutation.data}
          className="mt-8"
        />
      )}
      
      <div className="mt-12 max-w-4xl mx-auto bg-white rounded-xl overflow-hidden shadow-md">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <div className="h-48 w-full bg-neutral-200 md:w-48 flex items-center justify-center">
              <QrCode size={80} className="text-neutral-400" />
            </div>
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-primary font-semibold">Alternative Verification</div>
            <h3 className="block mt-1 text-lg leading-tight font-medium text-neutral-900">
              Scan the barcode on your medication
            </h3>
            <p className="mt-2 text-neutral-600">
              Most genuine medications have a barcode that can be scanned for quick verification. Our app can use your camera to verify authenticity.
            </p>
            <div className="mt-4">
              <Button
                onClick={handleScanBarcode}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary-light hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <QrCode className="mr-2 h-4 w-4" /> Scan Barcode
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
