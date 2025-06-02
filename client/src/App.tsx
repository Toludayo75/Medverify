import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import NotFound from "./pages/not-found";
import HomePage from "./pages/home-page";
import VerifyPage from "./pages/verify-page";
import ReportPage from "./pages/report-page";
import EducationPage from "./pages/education-page";
import AdminPage from "./pages/admin-page";
import AuthPage from "./pages/auth-page";
import ProfilePage from "./pages/profile-page";
import NotificationsPage from "./pages/notifications-page";
import MyVerificationsPage from "./pages/my-verifications-page";
import MyReportsPage from "./pages/my-reports-page";

// Policy and Legal pages
import PrivacyPolicyPage from "./pages/privacy-policy-page";
import TermsOfServicePage from "./pages/terms-of-service-page";
import CookiePolicyPage from "./pages/cookie-policy-page";

// Resource pages
import ResourcePage from "./pages/resource-page";
import IdentifyFakeDrugsPage from "./pages/identify-fake-drugs-page";
import SafePurchasingPage from "./pages/safe-purchasing-page";
import HealthcareProfessionalsPage from "./pages/healthcare-professionals-page";
import DownloadGuidelinesPage from "./pages/download-guidelines-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/verify" component={VerifyPage} />
      <Route path="/report" component={ReportPage} />
      <Route path="/education" component={EducationPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      
      {/* Policy Routes */}
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      <Route path="/cookie-policy" component={CookiePolicyPage} />
      
      {/* Resource Routes */}
      <Route path="/resources" component={ResourcePage} />
      <Route path="/resources/identify-fake-drugs" component={IdentifyFakeDrugsPage} />
      <Route path="/resources/safe-purchasing" component={SafePurchasingPage} />
      <Route path="/resources/healthcare-professionals" component={HealthcareProfessionalsPage} />
      <Route path="/resources/download-guidelines" component={DownloadGuidelinesPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;