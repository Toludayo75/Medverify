import { Helmet } from "react-helmet";
import { ArrowLeft, Shield, ShieldCheck, ShieldAlert, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SafePurchasingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Safe Purchasing Guidelines | MedVerify</title>
        <meta name="description" content="Learn how to safely purchase medications and reduce your risk of counterfeit drugs." />
      </Helmet>
      
      <div className="mb-8">
        <Link href="/resources" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Link>
        <h1 className="text-3xl font-bold">Safe Purchasing Guidelines</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Best practices to follow when purchasing medications to ensure their authenticity
        </p>
      </div>
      
      <div className="prose max-w-none mb-12">
        <p className="lead">
          Counterfeit medications pose serious health risks. Follow these guidelines to reduce your chances of purchasing fake drugs and protect your health.
        </p>
        
        <div className="bg-primary/10 rounded-lg p-6 my-8">
          <div className="flex items-start">
            <ShieldCheck className="h-10 w-10 text-primary mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold mt-0 mb-2">The Safe Purchasing Checklist</h2>
              <p className="mb-0 mt-0">
                Before making any medication purchase, follow this checklist to significantly reduce your risk of counterfeit drugs.
              </p>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Know Your Pharmacy</h2>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="h-5 w-5 text-green-600 mr-2" />
              Licensed Pharmacies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Purchase medications only from NAFDAC-accredited pharmacies</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Check if the pharmacy displays its license and registration certificates</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Develop a relationship with your pharmacist so they know your medication history</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">✗</span>
                <span>Avoid purchasing from unlicensed street vendors or open markets</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Online Purchasing Safety</h2>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <ShieldAlert className="h-5 w-5 text-amber-600 mr-2" />
              Online Pharmacy Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Only purchase from online pharmacies registered with NAFDAC</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Look for secure website indicators (https://, privacy policy, secure payment options)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Verify the physical address and phone number are legitimate</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">✗</span>
                <span>Beware of unusually low prices that seem "too good to be true"</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">✗</span>
                <span>Avoid sites that don't require a prescription for prescription medications</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Examine Your Purchase</h2>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <ShoppingBag className="h-5 w-5 text-blue-600 mr-2" />
              Before Using Medication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Verify the NAFDAC registration number on every purchase using MedVerify</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Examine packaging for tampering or damage</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Check expiration dates and batch numbers</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Compare the appearance of the medication to previous purchases</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">✗</span>
                <span>Never take medication that looks, smells, or tastes different than usual</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Keep Records</h2>
        
        <p>
          Maintain records of your purchases to help with reporting if you encounter a counterfeit:
        </p>
        
        <ul className="list-disc pl-6 mb-6">
          <li>Save receipts from all medication purchases</li>
          <li>Take note of the pharmacy name, location, and date of purchase</li>
          <li>Keep track of batch numbers for important medications</li>
          <li>Take photos of suspicious medications for reporting purposes</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Price Awareness</h2>
        
        <p>
          Be suspicious of prices that seem unusually low compared to other pharmacies. Counterfeit drugs are often sold at lower prices to attract buyers. If a deal seems too good to be true, it probably is.
        </p>
        
        <Separator className="my-8" />
        
        <h3 className="text-xl font-semibold mt-8 mb-4">If You Suspect a Counterfeit</h3>
        
        <p>If you believe you have purchased a counterfeit medication:</p>
        <ol className="list-decimal pl-6 mb-6">
          <li>Do not take the medication</li>
          <li>Keep the medication and packaging as evidence</li>
          <li>Report it immediately through our <Link href="/report" className="text-primary hover:underline">reporting system</Link></li>
          <li>Contact the pharmacy where you purchased it</li>
          <li>If you've already taken the medication and experience unusual symptoms, seek medical attention immediately</li>
        </ol>
      </div>
      
      <div className="bg-primary/10 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-3">Verify Before You Take</h3>
        <p className="mb-4">
          Always verify the NAFDAC number on your medication before taking it, especially if it's a new purchase.
        </p>
        <Link href="/verify">
          <Button>Verify Your Medication</Button>
        </Link>
      </div>
      
      <div className="flex justify-between items-center border-t pt-6">
        <Link href="/resources/identify-fake-drugs">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            How to Identify Fake Drugs
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