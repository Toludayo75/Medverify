import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { FileText, Download, Users, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResourcePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Helmet>
        <title>Resources | MedVerify</title>
        <meta name="description" content="Educational resources on drug safety, counterfeit medication detection, and best practices for healthcare professionals." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Resources</h1>
      <p className="text-lg mb-8 text-muted-foreground">
        Find helpful guides, educational materials, and resources to help you identify counterfeit medications and stay safe.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              How to Identify Fake Drugs
            </CardTitle>
            <CardDescription>
              Learn the visual and physical indicators of counterfeit medications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Counterfeit medications often have subtle differences from genuine products. This guide teaches you how to spot red flags including packaging irregularities, printing errors, unusual appearance, and more.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/resources/identify-fake-drugs">
              <Button variant="outline" className="w-full">Read Guide</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Safe Purchasing Guidelines
            </CardTitle>
            <CardDescription>
              Best practices for buying medications safely
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Learn how to reduce your risk when purchasing medications. This comprehensive guide covers how to identify licensed pharmacies, verify online sources, and ensure your medications come from legitimate supply chains.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/resources/safe-purchasing">
              <Button variant="outline" className="w-full">Read Guide</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              For Healthcare Professionals
            </CardTitle>
            <CardDescription>
              Resources for doctors, pharmacists, and medical staff
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Special resources for healthcare providers, including clinical guidelines for identifying counterfeit drugs, reporting procedures, patient education materials, and best practices for procurement.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/resources/healthcare-professionals">
              <Button variant="outline" className="w-full">View Resources</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-primary/10 rounded-lg p-8 mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Drug Safety Guidelines</h2>
            <p className="mb-4">
              Download our comprehensive drug safety guidelines document with detailed information on 
              how to protect yourself from counterfeit medications, proper storage practices, 
              and what to do if you suspect you've purchased fake drugs.
            </p>
            <Link href="/resources/download-guidelines">
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Guidelines (PDF)
              </Button>
            </Link>
          </div>
          <div className="w-1/3 hidden md:block">
            <div className="bg-primary/20 h-48 rounded-lg flex items-center justify-center">
              <FileText className="h-16 w-16 text-primary/60" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Latest Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Drug Regulation Updates</CardTitle>
              <CardDescription>May 10, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                NAFDAC has released new guidelines for pharmaceutical companies regarding packaging security features to combat counterfeiting. Learn how these changes affect medicine verification.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/resources/regulation-updates">
                <Button variant="ghost">Read More</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Community Alert System</CardTitle>
              <CardDescription>April 27, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Stay informed about counterfeit drug alerts in your region. Our new community alert system allows healthcare professionals and consumers to receive timely notifications about detected counterfeits.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Subscribe to Alerts
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="bg-muted rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
        <p className="mb-6">
          If you can't find what you're looking for or need personalized assistance, our team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/contact">
            <Button variant="outline">Contact Support</Button>
          </Link>
          <Link href="/education">
            <Button variant="secondary">Visit Education Center</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}