import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReportForm from "@/components/drug-verify/ReportForm";
import { CheckCircle2 } from "lucide-react";

export default function ReportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section id="report" className="py-16 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-neutral-900">Report Suspicious Medications</h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-neutral-600">
                Help protect the community by reporting potentially counterfeit medications.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
                <h3 className="text-lg font-medium text-neutral-900 mb-6">Submit a Report</h3>
                <ReportForm />
              </div>
              
              <div className="flex flex-col space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">What Happens After Reporting?</h3>
                  <ul className="space-y-4">
                    <li className="flex">
                      <CheckCircle2 className="text-secondary flex-shrink-0 mt-1" />
                      <span className="ml-3 text-neutral-600">Your report is reviewed by NAFDAC regulators</span>
                    </li>
                    <li className="flex">
                      <CheckCircle2 className="text-secondary flex-shrink-0 mt-1" />
                      <span className="ml-3 text-neutral-600">Sample may be collected for laboratory analysis</span>
                    </li>
                    <li className="flex">
                      <CheckCircle2 className="text-secondary flex-shrink-0 mt-1" />
                      <span className="ml-3 text-neutral-600">The product may be flagged in the system during investigation</span>
                    </li>
                    <li className="flex">
                      <CheckCircle2 className="text-secondary flex-shrink-0 mt-1" />
                      <span className="ml-3 text-neutral-600">If confirmed counterfeit, enforcement action will be taken</span>
                    </li>
                    <li className="flex">
                      <CheckCircle2 className="text-secondary flex-shrink-0 mt-1" />
                      <span className="ml-3 text-neutral-600">Public alerts may be issued for dangerous counterfeits</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-primary-light bg-opacity-50 rounded-xl shadow-sm p-6">
                  <div className="flex items-start">
                    <CheckCircle2 className="text-2xl text-primary flex-shrink-0" />
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-primary">Your Safety is Our Priority</h3>
                      <p className="mt-1 text-neutral-700">
                        All reports are taken seriously and investigated thoroughly. Your contribution helps protect countless others from harmful counterfeit medications.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-xl overflow-hidden shadow-sm bg-white p-8">
                  <div className="w-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z"/>
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-neutral-900">Safe Medication Verification</h3>
                      <p className="text-neutral-600 max-w-md">
                        Our platform helps you ensure your medications are authentic and safe to use
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
