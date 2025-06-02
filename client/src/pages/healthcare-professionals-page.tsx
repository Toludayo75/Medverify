import { Helmet } from "react-helmet";
import { ArrowLeft, FileDown, Stethoscope, BookOpen, Users, Info } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HealthcareProfessionalsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Healthcare Professional Resources | MedVerify</title>
        <meta name="description" content="Dedicated resources for healthcare professionals to identify, report, and prevent counterfeit medications." />
      </Helmet>
      
      <div className="mb-8">
        <Link href="/resources" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Resources
        </Link>
        <h1 className="text-3xl font-bold">For Healthcare Professionals</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Specialized resources for doctors, pharmacists, and healthcare providers
        </p>
      </div>
      
      <div className="bg-primary/10 rounded-lg p-6 mb-10">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <Stethoscope className="h-12 w-12 text-primary flex-shrink-0" />
          <div>
            <h2 className="text-xl font-bold mb-2">Professional Verification Portal</h2>
            <p className="mb-4">
              As a healthcare professional, you have access to our enhanced verification system with batch tracking, dispensing history, and pharmaceutical database integration.
            </p>
            <Button className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Register for Professional Access
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="clinical" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clinical">Clinical Guidelines</TabsTrigger>
          <TabsTrigger value="education">Patient Education</TabsTrigger>
          <TabsTrigger value="reporting">Reporting Protocols</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clinical" className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">Clinical Guidelines</h2>
          <p className="mb-6">
            These resources are designed to help healthcare professionals identify and respond to potential counterfeit medications in clinical settings.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Identification Protocol
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Clinical guidelines for identifying counterfeit medications, including visual inspection techniques, patient symptom recognition, and validation procedures.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/download-guidelines" className="w-full">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <FileDown className="h-4 w-4" />
                    Download PDF
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Case Studies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Real-world case studies of counterfeit drug incidents, clinical presentations, adverse reactions, and lessons learned from healthcare settings.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/case-studies">
                  <Button variant="outline" className="w-full">View Case Studies</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="education" className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">Patient Education Materials</h2>
          <p className="mb-6">
            Resources to help you educate patients about counterfeit drug risks and safe medication practices.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Printable Patient Handouts</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Clear, simple patient education materials covering safe medication purchasing, identifying suspicious medications, and verification procedures.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/download-guidelines" className="w-full">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <FileDown className="h-4 w-4" />
                    Download Materials
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Counseling Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Structured guidance for discussing medication safety with patients, including key talking points, questions to ask, and risk assessment tools.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/download-guidelines" className="w-full">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <FileDown className="h-4 w-4" />
                    Download PDF
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reporting" className="pt-6">
          <h2 className="text-2xl font-semibold mb-4">Reporting Protocols</h2>
          <p className="mb-6">
            Critical information on how healthcare professionals should report suspected counterfeit medications.
          </p>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Healthcare Professional Reporting Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Follow these steps when you encounter a suspected counterfeit medication:
              </p>
              
              <ol className="list-decimal pl-6 space-y-2">
                <li>Secure the medication and all packaging - do not discard anything</li>
                <li>Document batch numbers, NAFDAC numbers, and where the medication was purchased</li>
                <li>Take clear photographs of the medication and packaging</li>
                <li>Complete the healthcare professional reporting form with as much detail as possible</li>
                <li>Follow up with NAFDAC and the manufacturer as needed</li>
              </ol>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col sm:flex-row w-full gap-4">
                <Link href="/report" className="flex-1">
                  <Button className="w-full">Submit Professional Report</Button>
                </Link>
                <Link href="/resources/download-guidelines" className="flex-1">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <FileDown className="h-4 w-4" />
                    Download Protocol
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="bg-muted rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-3">Professional Training Resources</h3>
        <p className="mb-4">
          Access our continuing education modules on counterfeit drug identification, patient counseling, and supply chain security.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="secondary">View Training Modules</Button>
          <Button variant="outline">Request In-Service Training</Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center border-t pt-6">
        <Link href="/resources/safe-purchasing">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Safe Purchasing Guidelines
          </Button>
        </Link>
        <Link href="/resources/identify-fake-drugs">
          <Button variant="outline" className="flex items-center">
            How to Identify Fake Drugs
            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
          </Button>
        </Link>
      </div>
    </div>
  );
}