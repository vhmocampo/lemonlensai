import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function FAQ() {
  const [, setLocation] = useLocation();

  const goBack = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto p-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6" 
          onClick={goBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Frequently Asked Questions</CardTitle>
            <p className="text-gray-600">Find answers to common questions about LemonLens.ai</p>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-2">
              <AccordionItem value="item-1" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                  What is LemonLens?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed pt-2">
                  LemonLens.ai is an AI-powered vehicle health reporting service that helps car buyers and owners make informed decisions. We analyze vehicle information to provide detailed reports about potential issues, maintenance needs, and repair estimates. Our AI reviews your vehicle details against thousands of real-world cases to give you insights that can save you money and prevent unexpected problems.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                  Why should I run premium reports?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed pt-2">
                  Premium reports provide comprehensive analysis that goes far beyond basic vehicle information. They include:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Detailed inspection tips for when you view the car in person</li>
                    <li>Accurate repair cost estimates based on your location</li>
                    <li>Analysis of Carfax data and vehicle history</li>
                    <li>Customized recommendations based on your specific situation</li>
                    <li>The ability to update reports as you gather more information</li>
                  </ul>
                  These insights can help you negotiate better prices, avoid costly surprises, and make confident purchasing decisions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                  What is a standard report vs. premium?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed pt-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Standard Report (Free):</h4>
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>Basic vehicle analysis</li>
                        <li>General maintenance reminders</li>
                        <li>Common issues for your vehicle model</li>
                        <li>Basic reliability overview</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Premium Report:</h4>
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>In-depth AI analysis of your specific vehicle</li>
                        <li>Personalized inspection checklist</li>
                        <li>Detailed repair cost estimates</li>
                        <li>Carfax data integration and analysis</li>
                        <li>Location-based pricing and recommendations</li>
                        <li>Negotiation tips and strategies</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-4">
                <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">
                  What should I submit in more information?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed pt-2">
                  The more details you provide, the more accurate and useful your report will be. Consider submitting:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Vehicle listings:</strong> Copy and paste the entire car listing from websites, dealers, or private sellers</li>
                    <li><strong>Carfax or AutoCheck reports:</strong> Vehicle history reports with accident, service, and ownership details</li>
                    <li><strong>Maintenance records:</strong> Service history, recent repairs, or maintenance documentation</li>
                    <li><strong>Your location:</strong> Zip code for accurate local pricing and recommendations</li>
                    <li><strong>Specific concerns:</strong> Any particular issues or questions you have about the vehicle</li>
                    <li><strong>Seller information:</strong> Details about the seller or dealership</li>
                    <li><strong>Test drive notes:</strong> Observations from your inspection or test drive</li>
                  </ul>
                  Don't worry about formatting - just paste or type whatever information you have, and our AI will parse and analyze it all.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
