import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";

export default function DownloadGuidelinesPage() {
  useEffect(() => {
    // Trigger download after a short delay
    const timer = setTimeout(() => {
      // Create an anchor element
      const link = document.createElement('a');
      link.href = '/api/downloads/safety-guidelines';
      link.setAttribute('download', 'MedVerify-Drug-Safety-Guidelines.pdf');
      link.click();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Helmet>
        <title>Download Drug Safety Guidelines | MedVerify</title>
        <meta name="description" content="Download comprehensive drug safety guidelines to protect yourself from counterfeit medications." />
      </Helmet>
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Drug Safety Guidelines</h1>
        <p className="text-lg text-muted-foreground">
          Thank you for downloading our comprehensive drug safety guidelines
        </p>
      </div>
      
      <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
        <h2 className="text-xl font-semibold text-green-800 mb-2">Download Started</h2>
        <p className="text-green-700">
          Your download should begin automatically. If it doesn't start, please click the button below.
        </p>
      </div>
      
      <div className="flex flex-col items-center space-y-4 mb-12">
        <a href="/api/downloads/safety-guidelines" download="MedVerify-Drug-Safety-Guidelines.pdf">
          <Button className="flex items-center gap-2 px-8 py-6">
            <Download className="h-5 w-5" />
            <span className="text-lg">Download Guidelines</span>
          </Button>
        </a>
        <p className="text-sm text-muted-foreground">
          PDF format, approximately 1MB
        </p>
      </div>
      
      <div className="bg-primary/10 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-3">Safety Tip</h3>
        <p className="mb-2">
          Always verify your medications using MedVerify's NAFDAC number verification tool before consumption.
        </p>
        <Link href="/verify">
          <Button variant="outline">Verify Medication</Button>
        </Link>
      </div>
      
      <div className="text-center">
        <Link href="/resources" className="inline-flex items-center text-sm text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Link>
      </div>
    </div>
  );
}