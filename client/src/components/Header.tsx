import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useLocation, Link } from "wouter";
import LoginModal from "@/components/auth/LoginModal";
import RegisterModal from "@/components/auth/RegisterModal";
import { Eye, Coins } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const { data: userData } = useUserCredits(); // This will poll for credits when authenticated
  const [, setLocation] = useLocation();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer" 
              onClick={() => setLocation("/")}
            >
              {/* Logo */}
              <div className="h-10 w-10 rounded-full bg-lemon-500 flex items-center justify-center mr-2">
                <Eye className="h-6 w-6 text-gray-900" />
              </div>
              <span className="text-xl font-bold text-gray-900">LemonLens.ai</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/how-it-works" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Our Process
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            {/* Logged out state */}
            {!user ? (
              <div className="flex space-x-3">
                <button 
                  onClick={() => setLoginModalOpen(true)} 
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lemon-500 rounded-md"
                >
                  Log in
                </button>
                <button 
                  onClick={() => setRegisterModalOpen(true)} 
                  className="px-4 py-2 text-sm font-medium text-white bg-lemon-500 hover:bg-lemon-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lemon-500 rounded-md"
                >
                  Sign up
                </button>
              </div>
            ) : (
              /* Logged in state */
              <div className="flex items-center">
                <span className="mr-3 text-sm text-gray-700 max-w-[200px] truncate hidden sm:inline-block">
                  Hi, {user.username || 'User'}
                </span>
                <div className="relative">
                  <button 
                    onClick={() => setMenuOpen(!menuOpen)} 
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lemon-500" 
                    id="user-menu-button"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user.username ? user.username[0].toUpperCase() : 'U'}
                      </span>
                    </div>
                  </button>
                  {menuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      {/* User info display */}
                      <div className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">Username</div>
                      <div className="text-sm text-gray-500 truncate">{user.email}</div>
                      </div>
                      {/* Credits display */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Credits</span>
                        <div className="flex items-center">
                        <span className="bg-lemon-100 text-lemon-800 px-2 py-1 rounded-full flex items-center">
                          <Coins className="h-4 w-4 text-lemon-500 mr-1" />
                          <span className="text-sm font-bold">
                          {user.credits !== undefined ? user.credits : (userData?.credits ?? '...')}
                          </span>
                        </span>
                        </div>
                        </div>
                      </div>
                      <button 
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }} 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                      Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginModal 
        open={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        onOpenRegister={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(true);
        }}
      />
      
      <RegisterModal 
        open={registerModalOpen} 
        onClose={() => setRegisterModalOpen(false)} 
        onOpenLogin={() => {
          setRegisterModalOpen(false);
          setLoginModalOpen(true);
        }}
      />
    </header>
  );
}
