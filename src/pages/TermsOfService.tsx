import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function TermsOfService() {
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
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">Agreement to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using LemonLens.ai ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Description of Service</h2>
                <p className="text-gray-700 leading-relaxed">
                  LemonLens.ai provides vehicle health reporting and analysis services based on data from various sources including repair sites, NHTSA complaints, online forums, and industry data. Our service helps users make informed decisions about vehicle purchases and maintenance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">User Accounts</h2>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the security of your account credentials</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>One person or legal entity may not maintain more than one account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Acceptable Use</h2>
                <p className="text-gray-700 leading-relaxed mb-3">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Use the service for any unlawful purpose or activity</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Use automated systems to access the service without permission</li>
                  <li>Reproduce, duplicate, or resell any part of the service</li>
                  <li>Submit false or misleading information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Subscription and Payment</h2>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Subscription fees are billed in advance on a recurring basis</li>
                  <li>All fees are non-refundable except as required by law</li>
                  <li>We reserve the right to change pricing with 30 days notice</li>
                  <li>Failure to pay may result in service suspension or termination</li>
                  <li>You may cancel your subscription at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Disclaimer of Warranties</h2>
                <p className="text-gray-700 leading-relaxed">
                  The information provided by LemonLens.ai is for general informational purposes only. While we strive for accuracy, we make no warranties about the completeness, reliability, or accuracy of this information. Vehicle reports should not be the sole basis for purchasing decisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  In no event shall LemonLens.ai be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Data Sources and Accuracy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Our reports are based on data from repair sites, NHTSA complaints, online forums, and JD Power. While we use reliable sources, we cannot guarantee the accuracy or completeness of all information. Users should verify critical information independently.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed">
                  The service and its original content, features, and functionality are owned by LemonLens.ai and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be interpreted and governed by the laws of [Jurisdiction], without regard to its conflict of law provisions. Any disputes arising from these terms will be resolved in the courts of [Jurisdiction].
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <ul className="list-none space-y-1 text-gray-700 mt-2">
                  <li>Email: legal@lemonlens.ai</li>
                  <li>Address: [Company Address]</li>
                </ul>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}