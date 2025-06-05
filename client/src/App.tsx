import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import HowItWorks from "@/pages/HowItWorks";
import ReportDetail from "@/pages/ReportDetail";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import Success from "@/pages/Success";
import Fail from "@/pages/Fail";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const { isAuthenticated, isLoading, sessionId } = useAuth();
  
  // If session data is loading, show nothing to prevent flashing
  if (isLoading) {
    return null;
  }
  
  return (
    <Switch>
      {/* Landing page is default, with explicit route to home for anonymous access */}
      <Route path="/" component={isAuthenticated ? Home : Landing} />
      <Route path="/home" component={Home} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/report/:reportId" component={ReportDetail} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/success" component={Success} />
      <Route path="/fail" component={Fail} />
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
