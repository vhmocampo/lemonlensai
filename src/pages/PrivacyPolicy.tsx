import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PrivacyPolicy() {
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
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  LemonLens.ai ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our vehicle health reporting service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
                <h3 className="text-xl font-medium mb-2">Personal Information</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Email address and account credentials</li>
                  <li>Vehicle information (make, model, year, mileage, VIN)</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-xl font-medium mb-2 mt-4">Technical Information</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>IP address and browser information</li>
                  <li>Device type and operating system</li>
                  <li>Usage patterns and preferences</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Provide vehicle health reports and analysis</li>
                  <li>Process payments and manage your account</li>
                  <li>Improve our services and user experience</li>
                  <li>Send important updates and notifications</li>
                  <li>Comply with legal obligations</li>
                  <li>Prevent fraud and ensure security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Information Sharing</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>With service providers who assist in operating our platform</li>
                  <li>When required by law or legal process</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate data</li>
                  <li>Deletion of your information</li>
                  <li>Data portability</li>
                  <li>Objection to processing</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Cookies</h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Data Retention</h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account and associated data at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <ul className="list-none space-y-1 text-gray-700 mt-2">
                  <li>Email: support@lemonlens.ai</li>
                </ul>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}