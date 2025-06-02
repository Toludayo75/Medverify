import { ArrowRight, Eye, AlertTriangle, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function EducationCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Visual Inspection Card */}
      <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Eye className="text-xl text-primary mr-2" />
            <h3 className="text-lg font-medium text-neutral-900">Visual Inspection</h3>
          </div>
          <p className="text-neutral-600 mb-4">
            Learn how to visually inspect medications for signs of counterfeiting.
          </p>
          <ul className="space-y-2 text-sm text-neutral-700 mb-4">
            <li className="flex items-start">
              <span className="text-secondary mr-2">✓</span>
              <span>Check packaging for poor printing quality or spelling errors</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary mr-2">✓</span>
              <span>Verify that colors, logos, and text match genuine products</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary mr-2">✓</span>
              <span>Examine tablet appearance, coating, and markings</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary mr-2">✓</span>
              <span>Check for unusual smells, tastes, or textures</span>
            </li>
          </ul>
          <Link href="/resources/identify-fake-drugs" className="text-primary hover:text-primary-dark font-medium inline-flex items-center">
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
      
      {/* Common Red Flags Card */}
      <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="text-xl text-warning-dark mr-2" />
            <h3 className="text-lg font-medium text-neutral-900">Common Red Flags</h3>
          </div>
          <p className="text-neutral-600 mb-4">
            Watch out for these warning signs that may indicate counterfeit products.
          </p>
          <ul className="space-y-2 text-sm text-neutral-700 mb-4">
            <li className="flex items-start">
              <span className="text-danger mr-2">✗</span>
              <span>Unusually low prices compared to market rate</span>
            </li>
            <li className="flex items-start">
              <span className="text-danger mr-2">✗</span>
              <span>Purchase from unauthorized or unverified sources</span>
            </li>
            <li className="flex items-start">
              <span className="text-danger mr-2">✗</span>
              <span>Unexpected side effects or lack of therapeutic effect</span>
            </li>
            <li className="flex items-start">
              <span className="text-danger mr-2">✗</span>
              <span>Missing or suspicious NAFDAC registration number</span>
            </li>
          </ul>
          <Link href="/resources/identify-fake-drugs" className="text-primary hover:text-primary-dark font-medium inline-flex items-center">
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
      
      {/* Safe Purchasing Card */}
      <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <ShoppingBag className="text-xl text-secondary mr-2" />
            <h3 className="text-lg font-medium text-neutral-900">Safe Purchasing Practices</h3>
          </div>
          <p className="text-neutral-600 mb-4">
            Follow these guidelines when buying medications to avoid counterfeits.
          </p>
          <ul className="space-y-2 text-sm text-neutral-700 mb-4">
            <li className="flex items-start">
              <span className="text-secondary mr-2">✓</span>
              <span>Purchase only from licensed pharmacies and authorized retailers</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary mr-2">✓</span>
              <span>Verify NAFDAC registration before purchasing</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary mr-2">✓</span>
              <span>Request and keep receipts for all medication purchases</span>
            </li>
            <li className="flex items-start">
              <span className="text-secondary mr-2">✓</span>
              <span>Be wary of online sellers without proper verification</span>
            </li>
          </ul>
          <Link href="/resources/safe-purchasing" className="text-primary hover:text-primary-dark font-medium inline-flex items-center">
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}