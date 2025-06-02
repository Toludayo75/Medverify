import { Helmet } from "react-helmet";

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Cookie Policy | MedVerify</title>
        <meta name="description" content="Learn about how MedVerify uses cookies to enhance your experience." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">Last Updated: May 18, 2025</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">What Are Cookies</h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Cookies</h2>
        <p>MedVerify uses cookies for several purposes, including:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Essential cookies:</strong> These are necessary for the website to function properly and cannot be turned off in our systems.</li>
          <li><strong>Authentication cookies:</strong> These help us identify you when you log in to your account and provide a secure browsing experience.</li>
          <li><strong>Analytics cookies:</strong> These cookies help us understand how visitors interact with our website, which pages are visited most often, and if users encounter any error messages.</li>
          <li><strong>Preference cookies:</strong> These cookies enable our website to remember information that changes the way the website behaves or looks, such as your preferred language.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">The Cookies We Set</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">Account Related Cookies</h3>
        <p>
          When you create an account with us, we use cookies to manage the signup process and general administration. These cookies are typically removed when you log out but may remain to remember your site preferences.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Session Cookies</h3>
        <p>
          We use session cookies to operate our service efficiently. Session cookies are usually deleted when you close your browser.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Third-Party Cookies</h3>
        <p>
          In some cases, we also use cookies provided by trusted third parties. Our site uses analytics services which help us understand how people use our site and how we can improve your experience. These cookies may track things such as how long you spend on the site and the pages you visit.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Managing Cookies</h2>
        <p>
          Most web browsers allow some control of most cookies through the browser settings. You can block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies. However, if you use your browser settings to block all cookies (including essential cookies), you may not be able to access all or parts of our site.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Our Cookie Policy</h2>
        <p>
          We may update our Cookie Policy from time to time. Any changes will be posted on this page, and if the changes are significant, we will provide a more prominent notice.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about our Cookie Policy, please contact us at:
        </p>
        <p className="mt-2">
          <strong>Email:</strong> privacy@medverify.ng<br />
          <strong>Phone:</strong> +234 (0) 1234 5678
        </p>
      </div>
    </div>
  );
}