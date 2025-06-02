import { Helmet } from "react-helmet";
import { ArrowLeft, AlertTriangle, Check, X, Eye, PlusSquare } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IdentifyFakeDrugsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>How to Identify Fake Drugs | MedVerify</title>
        <meta name="description" content="Learn the visual and physical indicators of counterfeit medications and how to protect yourself from fake drugs." />
      </Helmet>
      
      <div className="mb-8">
        <Link href="/resources" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Link>
        <h1 className="text-3xl font-bold">How to Identify Fake Drugs</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Learn the visual and physical indicators that can help you spot counterfeit medications
        </p>
      </div>
      
      <div className="prose max-w-none mb-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mr-3" />
            <p className="text-yellow-700">
              <strong>Important:</strong> While these guidelines can help you identify potential counterfeit drugs, 
              the most reliable verification method is to use MedVerify's NAFDAC number verification tool. 
              When in doubt, consult a healthcare professional.
            </p>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Packaging Inspection</h2>
        <p>Counterfeiters often struggle to perfectly replicate legitimate drug packaging. Look for these signs:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
              <X className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium">Poor Print Quality</h4>
              <p className="text-sm text-gray-600">Blurry text, faded colors, or pixelated logos</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
              <X className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium">Spelling Errors</h4>
              <p className="text-sm text-gray-600">Misspelled drug names, ingredients, or manufacturer information</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
              <X className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium">Missing Security Features</h4>
              <p className="text-sm text-gray-600">No hologram, authentication code, or safety seal</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
              <X className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium">Package Damage</h4>
              <p className="text-sm text-gray-600">Signs of tampering or unusual package construction</p>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Physical Appearance</h2>
        <p>The medication itself may have telltale signs of being counterfeit:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
              <Eye className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium">Unusual Color or Texture</h4>
              <p className="text-sm text-gray-600">Different color, spotting, powdery coating, or excessive crumbling</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
              <Eye className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium">Size and Shape</h4>
              <p className="text-sm text-gray-600">Inconsistent size, wrong shape, or irregular edges compared to genuine medication</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
              <Eye className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium">Unusual Smell or Taste</h4>
              <p className="text-sm text-gray-600">Strange odor or taste that differs from the genuine product</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-full mr-3 mt-1">
              <Eye className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium">Inconsistent Marking</h4>
              <p className="text-sm text-gray-600">Unclear, missing, or different imprints/markings on tablets or capsules</p>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Legitimate Sources</h2>
        <p>One of the best ways to avoid counterfeit drugs is to purchase medications from reputable sources:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">Licensed Pharmacies</h4>
              <p className="text-sm text-gray-600">Buy from registered pharmacies with proper NAFDAC certification</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">Verify Online Pharmacies</h4>
              <p className="text-sm text-gray-600">Check that online sources are authorized retailers</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">Avoid Street Vendors</h4>
              <p className="text-sm text-gray-600">Never purchase medications from unauthorized street vendors</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium">Verify Each Purchase</h4>
              <p className="text-sm text-gray-600">Always check the NAFDAC number with MedVerify before using</p>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">What To Do If You Suspect Counterfeit Drugs</h2>
        <ol className="list-decimal pl-6">
          <li className="mb-2">Do not take the medication</li>
          <li className="mb-2">Keep the packaging and medication for evidence</li>
          <li className="mb-2">Report the suspected counterfeit to NAFDAC using our <Link href="/report" className="text-primary hover:underline">reporting tool</Link></li>
          <li className="mb-2">Return the product to the pharmacy where it was purchased</li>
          <li className="mb-2">If you've already taken the medication, consult a healthcare professional immediately</li>
        </ol>
      </div>
      
      <div className="bg-primary/10 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-3">Verify Your Medication Now</h3>
        <p className="mb-4">
          The most reliable way to check if your medication is genuine is to verify its NAFDAC number.
        </p>
        <Link href="/verify">
          <Button>Verify NAFDAC Number</Button>
        </Link>
      </div>
      
      <div className="flex justify-between items-center border-t pt-6">
        <Link href="/resources/safe-purchasing">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Safe Purchasing Guidelines
          </Button>
        </Link>
        <Link href="/resources/healthcare-professionals">
          <Button variant="outline" className="flex items-center">
            For Healthcare Professionals
            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  );
}