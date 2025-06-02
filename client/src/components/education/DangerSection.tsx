import { Button } from "@/components/ui/button";
import { PillBottle, AlertCircle, Scale } from "lucide-react";
import { Link } from "wouter";

export default function DangerSection() {
  return (
    <div className="mt-12 bg-neutral-50 rounded-xl p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-2xl font-bold font-display text-neutral-900">The Dangers of Counterfeit Medications</h3>
          <p className="mt-4 text-neutral-600">
            Counterfeit medications pose serious health risks and can lead to treatment failure, adverse reactions, or even death.
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-danger-light flex items-center justify-center">
                <PillBottle className="text-sm text-danger h-3.5 w-3.5" />
              </div>
              <div className="ml-3">
                <h4 className="text-base font-medium text-neutral-900">No Active Ingredients</h4>
                <p className="mt-1 text-sm text-neutral-600">Many counterfeits contain no active ingredients, leading to treatment failure.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-danger-light flex items-center justify-center">
                <AlertCircle className="text-sm text-danger h-3.5 w-3.5" />
              </div>
              <div className="ml-3">
                <h4 className="text-base font-medium text-neutral-900">Harmful Substances</h4>
                <p className="mt-1 text-sm text-neutral-600">Some contain toxic chemicals that can cause serious harm or death.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-danger-light flex items-center justify-center">
                <Scale className="text-sm text-danger h-3.5 w-3.5" />
              </div>
              <div className="ml-3">
                <h4 className="text-base font-medium text-neutral-900">Incorrect Dosage</h4>
                <p className="mt-1 text-sm text-neutral-600">Wrong amounts of active ingredients can lead to underdosing or overdosing.</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/resources/download-guidelines">
              <Button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Download Safety Guide
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="rounded-xl shadow-lg bg-white p-8 w-full">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-neutral-900">Protect Yourself & Others</h3>
                <p className="text-neutral-600 max-w-md">
                  Always verify your medications through our platform before use. Your health and safety depend on authentic pharmaceuticals.
                </p>
                <div className="pt-2">
                  <Link href="/verify">
                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                      Verify Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
