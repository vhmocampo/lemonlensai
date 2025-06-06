import { useLocation } from "wouter";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Fail() {
  const [location, setLocation] = useLocation();

  // Return to reports list
  const goToReports = () => {
    setLocation("/");
  };

  // Try payment again (redirect back to home where they can purchase credits)
  const tryAgain = () => {
    setLocation("/");
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-700">
            Payment Failed
          </CardTitle>
          <CardDescription>
            We couldn't process your payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-700">
              Your payment was not completed. This could be due to:
            </p>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• Insufficient funds</li>
              <li>• Card declined by your bank</li>
              <li>• Network connectivity issues</li>
              <li>• Expired or invalid card details</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Button onClick={tryAgain} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <Button variant="outline" onClick={goToReports} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
