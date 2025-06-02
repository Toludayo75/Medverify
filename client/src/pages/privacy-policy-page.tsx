import { Helmet } from "react-helmet";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Privacy Policy | MedVerify</title>
        <meta name="description" content="MedVerify Privacy Policy - Learn how we protect your personal information." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">Last Updated: May 18, 2025</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Overview</h2>
        <p>
          MedVerify ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our pharmaceutical verification service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <p>We collect information that you provide directly to us when:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Creating an account</li>
          <li>Submitting drug verification requests</li>
          <li>Reporting suspected counterfeit medications</li>
          <li>Contacting our support team</li>
          <li>Subscribing to our newsletters</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide and maintain our verification services</li>
          <li>Process and complete drug verification requests</li>
          <li>Investigate reports of counterfeit medications</li>
          <li>Improve our drug database and detection capabilities</li>
          <li>Communicate with you about your account or requests</li>
          <li>Send you technical notices, updates, and security alerts</li>
          <li>Monitor and analyze usage patterns and trends</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Retention</h2>
        <p>
          We retain personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. We will securely delete your personal information when it is no longer needed for these purposes.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption of sensitive data, regular security assessments, and strict access controls for our staff.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Sharing Your Information</h2>
        <p>We may share your information with:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Regulatory authorities (like NAFDAC) when required by law</li>
          <li>Law enforcement agencies investigating counterfeit medication cases</li>
          <li>Service providers who assist us in operating our platform</li>
          <li>Healthcare partners for verification purposes</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
        <p>Depending on your location, you may have rights to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Access the personal information we hold about you</li>
          <li>Correct inaccurate personal information</li>
          <li>Delete your personal information</li>
          <li>Restrict or object to our processing of your information</li>
          <li>Export your data in a portable format</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p className="mt-2">
          <strong>Email:</strong> privacy@medverify.ng<br />
          <strong>Address:</strong> Plot 2032 Olusegun Obasanjo Way, Abuja, Nigeria
        </p>
      </div>
    </div>
  );
}