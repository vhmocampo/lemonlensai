import { useLocation } from "wouter";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Success() {
  const [location, setLocation] = useLocation();

  // Return to reports list
  const goToReports = () => {
    setLocation("/");
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-700">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-700">
              Thank you for your purchase! Your credits have been added to your account.
            </p>
            <p className="text-sm text-gray-500">
              You can now generate detailed vehicle reports with your new credits.
            </p>
          </div>
          
          <Button onClick={goToReports} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Reports
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
