import { Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function AnonymousAlert() {
  const { loginWithModal } = useAuth();

  return (
    <div className="bg-lemon-100 border-b border-lemon-300">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center">
            <span className="flex p-2 rounded-lg bg-lemon-500">
              <Info className="h-5 w-5 text-gray-900" />
            </span>
            <p className="ml-3 text-sm font-medium text-gray-800">
              You're browsing as a guest. <span className="hidden sm:inline">Your reports will be saved to this device only.</span>
            </p>
          </div>
          <div className="order-3 mt-2 sm:mt-0 sm:ml-3">
            <button 
              onClick={loginWithModal}
              className="flex items-center px-2 py-1 text-sm font-medium text-gray-900 bg-lemon-300 hover:bg-lemon-400 rounded-md"
            >
              Sign in to save reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
