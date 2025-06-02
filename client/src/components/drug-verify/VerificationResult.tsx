import { Link } from "wouter";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type VerificationResultProps = {
  result: {
    drug?: {
      id: number;
      nafdacNumber: string;
      productName: string;
      manufacturer: string;
      dosageForm: string;
      strength: string;
      status: "genuine" | "counterfeit" | "flagged";
      isBlacklisted: boolean;
    };
    batch?: {
      id: number;
      batchNumber: string;
      manufactureDate: string;
      expiryDate: string;
    };
    verification?: {
      id: number;
      status: "genuine" | "counterfeit" | "flagged";
      createdAt: string;
    };
    counterfeit?: boolean;
    nafdacNumber?: string;
    message?: string;
  };
  className?: string;
};

export default function VerificationResult({ result, className = "" }: VerificationResultProps) {
  const { drug, batch, verification, counterfeit, nafdacNumber, message } = result;
  
  // Format dates if they exist
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  
  const getResultBox = () => {
    // Handle counterfeit drugs not in the database
    if (counterfeit === true) {
      return (
        <div className="bg-red-50 border-l-4 border-danger p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="text-2xl text-danger" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-danger">Counterfeit Alert</h3>
              <p className="mt-2 text-sm text-neutral-700">
                This product with NAFDAC number {nafdacNumber} is not found in our official database. It may be counterfeit or unregistered.
              </p>
              <div className="mt-4 flex items-center">
                <Link href={`/report?nafdac=${nafdacNumber || ''}`}>
                  <Button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-danger hover:bg-danger-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger">
                    Report This Product
                  </Button>
                </Link>
                <Link href="/education" className="ml-4 text-sm text-danger hover:text-danger-dark">
                  What to do now?
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle registered drugs
    if (!drug) return null;
    
    switch (drug.status) {
      case "genuine":
        return (
          <div className="bg-green-50 border-l-4 border-secondary p-4 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle2 className="text-2xl text-secondary" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-secondary">Genuine Medication</h3>
                <p className="mt-2 text-sm text-neutral-700">
                  This product is verified as authentic by NAFDAC.
                </p>
                <div className="mt-4">
                  <div className="flex flex-col space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <span className="text-sm font-medium text-neutral-500">Product Name:</span>
                      <span className="text-sm text-neutral-900">{drug.productName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <span className="text-sm font-medium text-neutral-500">Manufacturer:</span>
                      <span className="text-sm text-neutral-900">{drug.manufacturer}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <span className="text-sm font-medium text-neutral-500">NAFDAC Number:</span>
                      <span className="text-sm text-neutral-900">{drug.nafdacNumber}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <span className="text-sm font-medium text-neutral-500">Dosage Form:</span>
                      <span className="text-sm text-neutral-900">{drug.dosageForm}</span>
                    </div>
                    {drug.strength && (
                      <div className="grid grid-cols-2 gap-4">
                        <span className="text-sm font-medium text-neutral-500">Strength:</span>
                        <span className="text-sm text-neutral-900">{drug.strength}</span>
                      </div>
                    )}
                    {batch && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-sm font-medium text-neutral-500">Batch Number:</span>
                          <span className="text-sm text-neutral-900">{batch.batchNumber}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-sm font-medium text-neutral-500">Date of Manufacture:</span>
                          <span className="text-sm text-neutral-900">{formatDate(batch.manufactureDate)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-sm font-medium text-neutral-500">Expiry Date:</span>
                          <span className="text-sm text-neutral-900">{formatDate(batch.expiryDate)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "counterfeit":
        return (
          <div className="bg-red-50 border-l-4 border-danger p-4 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="text-2xl text-danger" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-danger">Counterfeit Medication Detected</h3>
                <p className="mt-2 text-sm text-neutral-700">
                  This product has been identified as counterfeit. Do not consume and report to authorities.
                </p>
                <div className="mt-4 flex items-center">
                  <Link href="/report">
                    <Button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-danger hover:bg-danger-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger">
                      Report This Product
                    </Button>
                  </Link>
                  <Link href="/education" className="ml-4 text-sm text-danger hover:text-danger-dark">
                    What to do now?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "flagged":
        return (
          <div className="bg-warning-light border-l-4 border-warning p-4 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="text-2xl text-warning-dark" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-warning-dark">Flagged for Review</h3>
                <p className="mt-2 text-sm text-neutral-700">
                  This product requires additional verification. NAFDAC has been notified for investigation.
                </p>
                <div className="mt-4 bg-white p-3 rounded border border-warning-light">
                  <p className="text-sm text-neutral-700">
                    <strong>Why was this flagged?</strong><br />
                    Possible reasons include: suspicious batch number, multiple reports from users, or pending verification.
                  </p>
                </div>
                <div className="mt-4 flex items-center">
                  <Link href="/report">
                    <Button variant="outline" className="inline-flex items-center px-4 py-2 border border-warning text-sm font-medium rounded-md shadow-sm text-warning-dark bg-white hover:bg-warning-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning">
                      Provide Additional Information
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`p-6 rounded-lg border ${className}`}>
      {message && (
        <div className="bg-red-50 p-3 rounded-md mb-4 text-danger text-sm">
          <strong>Important:</strong> {message}
        </div>
      )}
      {getResultBox()}
    </div>
  );
}
