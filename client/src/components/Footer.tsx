import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail 
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Footer() {
  const { user } = useAuth();
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-6">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="ml-2 text-lg font-display font-bold text-white">MedVerify</span>
            </div>
            <p className="text-neutral-400 mb-4">
              Protecting public health by ensuring the safety and efficacy of pharmaceutical products across Nigeria.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {(!user || user.role !== 'admin') && (
            <div>
              <h3 className="text-lg font-medium text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-neutral-400 hover:text-white">Home</Link>
                </li>
                <li>
                  <Link href="/verify" className="text-neutral-400 hover:text-white">Verify Medication</Link>
                </li>
                <li>
                  <Link href="/report" className="text-neutral-400 hover:text-white">Report Suspicious Drug</Link>
                </li>
                <li>
                  <Link href="/education" className="text-neutral-400 hover:text-white">Drug Safety Education</Link>
                </li>
                <li>
                  <a href="https://www.nafdac.gov.ng" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white">NAFDAC Official Website</a>
                </li>
              </ul>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium text-white mb-6">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/resources/identify-fake-drugs" className="text-neutral-400 hover:text-white">How to Identify Fake Drugs</Link>
              </li>
              <li>
                <Link href="/resources/safe-purchasing" className="text-neutral-400 hover:text-white">Safe Purchasing Guidelines</Link>
              </li>
              <li>
                <Link href="/resources/healthcare-professionals" className="text-neutral-400 hover:text-white">For Healthcare Professionals</Link>
              </li>
              <li>
                <Link href="/resources" className="text-neutral-400 hover:text-white">Drug Regulation Updates</Link>
              </li>
              <li>
                <a href="/resources" className="text-neutral-400 hover:text-white">Access Resources</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-6">Contact</h3>
            <ul className="space-y-3 text-neutral-400">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-primary flex-shrink-0" size={18} />
                <span>NAFDAC Headquarters<br />Plot 2032 Olusegun Obasanjo Way<br />Abuja, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-primary flex-shrink-0" size={18} />
                <span>+234 (0) 1234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-primary flex-shrink-0" size={18} />
                <span>info@nafdacverify.gov.ng</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-neutral-800 text-neutral-400 text-sm flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MedVerify. All rights reserved.
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-white">Cookie Policy</Link>
            <Link href="/auth" className="hover:text-white font-semibold text-amber-500">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
