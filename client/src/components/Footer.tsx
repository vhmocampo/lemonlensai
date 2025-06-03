import { useState } from "react";
import { Link } from "wouter";
import ContactDialog from "./ContactDialog";

export default function Footer() {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const openContactDialog = () => {
    setContactDialogOpen(true);
  };

  const closeContactDialog = () => {
    setContactDialogOpen(false);
  };

  return (
    <>
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center space-x-6 md:order-2">
              <Link href="/how-it-works" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">How it Works</span>
                <span className="text-sm">How it Works</span>
              </Link>
              <Link href="/privacy-policy" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Privacy Policy</span>
                <span className="text-sm">Privacy Policy</span>
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Terms of Service</span>
                <span className="text-sm">Terms of Service</span>
              </Link>
              <button onClick={openContactDialog} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Contact</span>
                <span className="text-sm">Contact</span>
              </button>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">&copy; {new Date().getFullYear()} LemonLens.ai. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
      
      <ContactDialog 
        open={contactDialogOpen} 
        onClose={closeContactDialog} 
      />
    </>
  );
}
