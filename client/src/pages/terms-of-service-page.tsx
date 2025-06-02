import { Helmet } from "react-helmet";

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Terms of Service | MedVerify</title>
        <meta name="description" content="Terms and conditions for using MedVerify's pharmaceutical verification services." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">Last Updated: May 18, 2025</p>
        
        <p className="mb-6">
          Welcome to MedVerify. By accessing or using our service, you agree to be bound by these Terms of Service. Please read them carefully.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Service Description</h2>
        <p>
          MedVerify provides a pharmaceutical verification platform that allows users to verify the authenticity of medications using NAFDAC registration numbers and report suspected counterfeit drugs. Our service is intended to complement, not replace, official regulatory processes.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Accounts</h2>
        <p>
          When you create an account with us, you agree to provide accurate, current, and complete information. You are responsible for safeguarding your password and for all activities that occur under your account. Notify us immediately of any unauthorized use of your account.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Responsibilities</h2>
        <p>As a user of our service, you agree to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide accurate information when verifying drugs or submitting reports</li>
          <li>Not use our service for any illegal or unauthorized purpose</li>
          <li>Not transmit harmful code or attempt to interfere with our systems</li>
          <li>Not impersonate any person or entity or falsely state your affiliation</li>
          <li>Not collect or harvest information about other users</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
        <p>
          The content, features, and functionality of MedVerify, including but not limited to text, graphics, logos, icons, images, and software, are owned by MedVerify and are protected by copyright, trademark, and other intellectual property laws.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Disclaimer of Warranties</h2>
        <p>
          While we strive to provide accurate information, our service is provided "as is" without warranties of any kind. We do not guarantee that our drug verification service will always identify counterfeit medications with 100% accuracy. Always consult healthcare professionals and official NAFDAC channels for conclusive information.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, MedVerify shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service, or for the cost of procurement of substitute services.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless MedVerify, its affiliates, officers, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses arising from your use of the service or violation of these terms.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
        <p>
          We may modify these Terms of Service at any time. We will provide notice of significant changes by posting the updated terms on our website. Your continued use of the service after such modifications constitutes your acceptance of the revised terms.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Governing Law</h2>
        <p>
          These Terms of Service are governed by the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at legal@medverify.ng.
        </p>
      </div>
    </div>
  );
}