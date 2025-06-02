import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Search, 
  AlertTriangle, 
  BookOpen, 
  Shield, 
  Users, 
  Clock, 
  Database,
  Pill,
  BarChart3,
  FileCheck
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-white pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8" id="home">
          <div className="absolute inset-0">
            <div className="bg-gradient-to-b from-primary/5 to-white h-1/3 sm:h-2/3"></div>
          </div>
          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                {user ? (
                  /* Content for logged-in users */
                  <>
                    <h1 className="text-3xl font-bold font-display text-neutral-900 sm:text-4xl">
                      Verify your medication's <span className="text-primary">authenticity</span> instantly
                    </h1>
                    <p className="mt-3 max-w-2xl text-xl text-neutral-600">
                      NAFDAC DrugVerify helps you confirm if your pharmaceuticals are genuine, protecting you from counterfeit medications.
                    </p>
                    <div className="mt-8">
                      <Link href="/verify">
                        <Button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                          Verify My Medication
                        </Button>
                      </Link>
                      <Link href="/education">
                        <Button variant="ghost" className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-primary bg-white hover:bg-neutral-50">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  /* Content for non-logged-in users */
                  <>
                    <h1 className="text-3xl font-bold font-display text-neutral-900 sm:text-4xl">
                      Combat counterfeit drugs with <span className="text-primary">NAFDAC DrugVerify</span>
                    </h1>
                    <p className="mt-3 max-w-2xl text-xl text-neutral-600">
                      Our platform helps you confirm if your pharmaceuticals are genuine, protecting you from dangerous counterfeit medications.
                    </p>
                    <div className="mt-8">
                      <Link href="/verify">
                        <Button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                          Verify My Medication
                        </Button>
                      </Link>
                      <Link href="/education">
                        <Button variant="ghost" className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-primary bg-white hover:bg-neutral-50">
                          Learn How It Works
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-center">
                <div className="h-96 w-full rounded-lg shadow-md overflow-hidden bg-primary/5 flex items-center justify-center">
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="rounded-full bg-primary-light p-4 mb-4">
                      <Pill className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium text-neutral-900">Safe Medication Verification</h3>
                    <p className="mt-2 text-neutral-600 max-w-sm">
                      Our platform helps you ensure your medications are authentic and safe to use
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Our Services Section */}
            <div className="mt-24 text-center">
              <h2 className="text-3xl font-bold text-neutral-900">Our Services</h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-neutral-600">
                Ensuring medication safety through technology and education
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-neutral-100 hover:shadow-md transition">
                <div className="rounded-full bg-primary-light p-3">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-neutral-900">Instant Verification</h3>
                <p className="mt-2 text-base text-neutral-600">
                  Verify your medication's authenticity in seconds using the NAFDAC registration number. No sign-in required.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-neutral-100 hover:shadow-md transition">
                <div className="rounded-full bg-warning-light p-3">
                  <AlertTriangle className="h-6 w-6 text-warning-dark" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-neutral-900">Report Suspicious Drugs</h3>
                <p className="mt-2 text-base text-neutral-600">
                  Help combat counterfeit medications by reporting suspicious products. Your reports help protect others.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-neutral-100 hover:shadow-md transition">
                <div className="rounded-full bg-secondary-light p-3">
                  <BookOpen className="h-6 w-6 text-secondary-dark" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-neutral-900">Drug Safety Education</h3>
                <p className="mt-2 text-base text-neutral-600">
                  Access resources about identifying counterfeit drugs and understanding their risks to your health.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900">How It Works</h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-neutral-600">
                Simple steps to verify your medications and ensure they're safe
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-blue-100 p-4 mb-4">
                  <Pill className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium">Find NAFDAC Number</h3>
                <p className="mt-2 text-neutral-600">Locate the NAFDAC registration number on your medication package</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-green-100 p-4 mb-4">
                  <Search className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Enter Details</h3>
                <p className="mt-2 text-neutral-600">Input the NAFDAC number and batch number (if available) into our verification tool</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-purple-100 p-4 mb-4">
                  <Database className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium">Instant Check</h3>
                <p className="mt-2 text-neutral-600">Our system verifies the information against the official NAFDAC database</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-amber-100 p-4 mb-4">
                  <FileCheck className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium">Get Results</h3>
                <p className="mt-2 text-neutral-600">Receive instant verification on whether your medication is genuine or suspicious</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/verify">
                <Button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary-dark">
                  Verify Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900">Why Use NAFDAC DrugVerify?</h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-neutral-600">
                Protecting public health through advanced verification technology
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-medium text-neutral-900">Enhanced Safety</h3>
                <p className="mt-2 text-neutral-600">
                  Protect yourself and your loved ones from potentially harmful counterfeit medications
                </p>
              </div>
              
              <div className="flex flex-col p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
                <Clock className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-medium text-neutral-900">Real-time Verification</h3>
                <p className="mt-2 text-neutral-600">
                  Get instant results about your medication's authenticity without delays
                </p>
              </div>
              
              <div className="flex flex-col p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-medium text-neutral-900">Community Protection</h3>
                <p className="mt-2 text-neutral-600">
                  Join thousands of Nigerians in the fight against counterfeit pharmaceuticals
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
