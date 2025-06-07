import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Car,
  Shield,
  LineChart,
  AlertTriangle,
  Award,
  CheckCircle,
  ArrowRight,
  Zap,
  BarChart4,
  Wrench,
  ShieldQuestion,
  Star,
} from "lucide-react";
import RegisterModal from "@/components/auth/RegisterModal";
import LoginModal from "@/components/auth/LoginModal";
import ContactDialog from "@/components/ContactDialog";

export default function Landing() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  // If user is logged in, redirect to home
  if (user) {
    setLocation("/");
    return null;
  }

  const openLoginModal = () => {
    setLoginModalOpen(true);
    setRegisterModalOpen(false);
  };

  const openRegisterModal = () => {
    setRegisterModalOpen(true);
    setLoginModalOpen(false);
  };

  const closeModals = () => {
    setLoginModalOpen(false);
    setRegisterModalOpen(false);
  };

  const openContactDialog = () => {
    setContactDialogOpen(true);
  };

  const closeContactDialog = () => {
    setContactDialogOpen(false);
  };

  const startAnonymous = () => {
    setLocation("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Header/Navigation */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
            <div className="text-yellow-500 mr-2">
              <img src="/images/ll.png" alt="LemonLens.ai Logo" className="h-11 w-auto" />
            </div>
          <h1 className="text-2xl font-bold text-gray-900">LemonLens.ai</h1>
        </div>
        <nav className="hidden md:flex space-x-6 items-center">
          <a
            href="#get-started"
            className="text-gray-600 hover:text-yellow-500 transition-colors"
          >
            Premium
          </a>
          <a
            href="#how-it-works"
            className="text-gray-600 hover:text-yellow-500 transition-colors"
          >
            What is it?
          </a>
          <a
            href="#pricing"
            className="text-gray-600 hover:text-yellow-500 transition-colors"
          >
            Pricing
          </a>
          <Button
            variant="outline"
            className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white transition"
            onClick={openLoginModal}
          >
            Sign In
          </Button>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white transition"
            onClick={openRegisterModal}
          >
            Get Started
          </Button>
        </nav>
        <div className="md:hidden">
          {/* Mobile menu button would go here */}
          <Button
            variant="outline"
            className="border-yellow-500 text-yellow-500"
            onClick={openLoginModal}
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Buy better used cars.
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Our premium reports can help you save thousands on unexpected repairs.<br />
            Standard reports are free, no credit card needed. <i>Forever.</i>
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-6 text-lg"
              onClick={openRegisterModal}
            >
              Get your Free Premium Report
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-6 text-lg"
              onClick={startAnonymous}
            >
              See an Example Report
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1625047509248-ec889cbff17f?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Mechanic working on car engine in garage"
              className="rounded-lg shadow-xl w-full max-w-lg"
            />
            <div className="absolute -bottom-4 -left-4 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg">
              <div className="text-sm font-medium">
                The average used car buyer faces
              </div>
              <div className="text-lg font-bold">$2,500+ in unexpected repairs</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What is LemonLens AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              LemonLens.ai helps you make smarter used car decisions. <br /> Instantly get detailed reports on any potential issues, repair costs, and reliability; all based on real-world data.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-500 mb-4">
                  <LineChart />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Smart Analysis
                </h3>
                <p className="text-gray-600">
                  We use AI to analyze real complaints from thousands of vehicles, surfacing the issues that matter most to you.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-500 mb-4">
                  <Shield />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Reliability Scoring
                </h3>
                <p className="text-gray-600">
                  Our reliability score and recommendation engine gives you a fast, detailed answer—much more than a typical listing.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-500 mb-4">
                  <Wrench />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Repair Estimates
                </h3>
                <p className="text-gray-600">
                  We don’t just spot likely issues, but we also estimate what they’ll cost, using trusted industry data. Premium reports include likelihood percentages and local, zip code-based estimates.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-6 text-lg"
              onClick={startAnonymous}
            >
              See Example Report
            </Button>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section id="get-started" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get started now.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              You can get your premium report in minutes!
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 mx-auto mb-4 relative">
                <Car />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-yellow-500 rounded-full text-white flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Enter Vehicle Details
              </h3>
              <p className="text-gray-600">
                Enter your car’s make, model, year, and mileage. Paste in a listing, Carfax, or any details you have—easy!
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 mx-auto mb-4 relative">
                <Zap />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-yellow-500 rounded-full text-white flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AI Analysis
              </h3>
              <p className="text-gray-600">
                Our AI instantly reviews your info against thousands of real-world cases and builds your custom report.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 mx-auto mb-4 relative">
                <BarChart4 />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-yellow-500 rounded-full text-white flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Premium Report
              </h3>
              <p className="text-gray-600">
                Get your detailed report in moments—including inspection tips, repair estimates, and key insights.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 mx-auto mb-4 relative">
                <Award />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-yellow-500 rounded-full text-white flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Make Informed Decisions
              </h3>
              <p className="text-gray-600">
                Use your report to plan maintenance, negotiate with sellers, or submit new details for even more accurate results.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-6 text-lg"
              onClick={openRegisterModal}
            >
              Sign up to get your first report free!
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the option that fits your needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Free
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    $0
                  </div>
                  <p className="text-gray-600">
                    Perfect for trying out the service
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                    <span>Unlimited standard reports</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                    <span>Plus (1) free premium report when you sign up</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                    <span>General reliability score & common issues</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                    <span>No credit card needed!</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={openRegisterModal}
                >
                  Sign Up Free
                </Button>
              </CardContent>
            </Card>
            <Card className="border-2 border-yellow-500 shadow-xl relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-white py-1 px-4 rounded-full text-sm font-medium">
                Best Value
              </div>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Buyer's Bundle
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    $19.99
                  </div>
                  <p className="text-gray-600">30 premium reports</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                    <span>Likelihood of upcoming repairs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                    <span>Tips for inspecting the car in person</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                    <span>Submit zip code and Carfax data for detailed analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                    <span>Update reports as you get answers from dealer</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={openRegisterModal}
                >
                  Get Bulk Reports
                </Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Single Premium
                  </h3>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    $5
                  </div>
                  <p className="text-gray-600">
                    Buy as you go
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                    <span>All premium report features</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
                    <span>Best for vehicle owners checking their vehicle health</span>
                  </li>
                  <li className="flex items-center">
                    <ShieldQuestion className="text-yellow-500 mr-2 h-5 w-5" />
                    <span>Consider buying in bulk if planning on running several</span>
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                  onClick={openRegisterModal}
                >
                  Buy One Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join the hundreds of satisfied customers who have saved money and made informed decisions with LemonLens.ai!
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="User avatar"
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">Mike L.</h4>
                    {/* <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div> */}
                  </div>
                </div>
                <p className="text-gray-600">
                  "LemonLens.ai helped me compare several Nissan 370z listings and find one with the best score—super easy and trustworthy!"
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="User avatar"
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">Tori C.</h4>
                  </div>
                </div>
                <p className="text-gray-600">
                  "I used LemonLens.ai to search for a reliable car within my budget. The standard report impressed me, so I tried premium and found a hidden gem—a 2012 Honda Odyssey nearby!"
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="User avatar"
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">David R.</h4>
                    {/* <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div> */}
                  </div>
                </div>
                <p className="text-gray-600">
                  "I brought my LemonLens.ai premium report for an LS460 to the dealer, updated it with their info, and discovered a costly timing belt replacement—saved me from a bad deal!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-yellow-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-white opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of smart vehicle owners who use LemonLens.ai to avoid
            unexpected repairs and make informed decisions.
          </p>
          <Button
            className="bg-white text-yellow-500 hover:bg-gray-100 px-8 py-6 text-lg"
            onClick={openRegisterModal}
          >
            Get Started Now <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Car className="text-yellow-500 mr-2" />
                <span className="text-xl font-bold">LemonLens.ai</span>
              </div>
              <p className="text-gray-400">
                AI-powered car analysis for smart buyers.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#get-started"
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    Premium
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    What is it?
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/faq"
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/how-it-works"
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    Our Process
                  </a>
                </li>
                <li>
                  <button
                    onClick={openContactDialog}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-of-service"
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} LemonLens.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal
        open={loginModalOpen}
        onClose={closeModals}
        onOpenRegister={openRegisterModal}
      />
      <RegisterModal
        open={registerModalOpen}
        onClose={closeModals}
        onOpenLogin={openLoginModal}
      />
      <ContactDialog open={contactDialogOpen} onClose={closeContactDialog} />
    </div>
  );
}
