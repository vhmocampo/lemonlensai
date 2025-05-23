import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import ReportDetail from "@/pages/ReportDetail";
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
      {/* Show the landing page if not authenticated, home page if authenticated */}
      <Route path="/" component={isAuthenticated ? Home : Landing} />
      <Route path="/report/:reportId" component={ReportDetail} />
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
