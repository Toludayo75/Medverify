import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LineChart, Flag, Database, FileText } from "lucide-react";

export default function DashboardTeaser() {
  return (
    <section className="py-16 bg-primary bg-opacity-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-primary-light px-4 py-1 rounded-full text-primary text-sm font-semibold mb-3">
            For Pharmacists & Regulators
          </div>
          <h2 className="text-3xl font-bold font-display text-neutral-900">Powerful Administrative Tools</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-neutral-600">
            Healthcare professionals and regulators get access to advanced features for monitoring and managing drug verification.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl font-bold font-display text-neutral-900">Admin Dashboard</h3>
                <p className="mt-4 text-neutral-600">
                  Our comprehensive dashboard provides regulators and pharmacists with real-time insights and powerful management tools.
                </p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start">
                    <LineChart className="text-xl text-primary mt-1 mr-3" />
                    <div>
                      <h4 className="text-base font-medium text-neutral-900">Real-time Analytics</h4>
                      <p className="mt-1 text-sm text-neutral-600">Monitor verification trends, hotspots of counterfeit reports, and user activity.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Flag className="text-xl text-warning-dark mt-1 mr-3" />
                    <div>
                      <h4 className="text-base font-medium text-neutral-900">Flagged Drugs Management</h4>
                      <p className="mt-1 text-sm text-neutral-600">Review and take action on suspicious or reported medications.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Database className="text-xl text-secondary mt-1 mr-3" />
                    <div>
                      <h4 className="text-base font-medium text-neutral-900">Bulk Verification</h4>
                      <p className="mt-1 text-sm text-neutral-600">Verify multiple drugs at once, perfect for pharmacies and healthcare facilities.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FileText className="text-xl text-primary mt-1 mr-3" />
                    <div>
                      <h4 className="text-base font-medium text-neutral-900">Detailed Reporting</h4>
                      <p className="mt-1 text-sm text-neutral-600">Generate comprehensive reports for regulatory purposes and internal audits.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/auth">
                    <Button className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      Request Admin Access
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-inner">
                <div className="aspect-video w-full bg-neutral-100 rounded flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="mx-auto h-16 w-16 text-neutral-300 mb-2" />
                    <p className="text-neutral-400 text-sm">Admin Dashboard Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
