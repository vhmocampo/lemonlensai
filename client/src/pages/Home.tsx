import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnonymousAlert from "@/components/AnonymousAlert";
import VehicleReportForm from "@/components/VehicleReportForm";
import ReportsList from "@/components/ReportsList";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'create' | 'reports'>('create');
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {!user && <AnonymousAlert />}
        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                <button 
                  onClick={() => setActiveTab('create')} 
                  className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'create' 
                      ? 'border-lemon-500 text-lemon-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Create Report
                </button>
                <button 
                  onClick={() => setActiveTab('reports')} 
                  className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'reports' 
                      ? 'border-lemon-500 text-lemon-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Reports
                </button>
              </nav>
            </div>

            {/* Content */}
            {activeTab === 'create' ? (
              <VehicleReportForm onReportCreated={() => setActiveTab('reports')} />
            ) : (
              <ReportsList onCreateReport={() => setActiveTab('create')} />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
