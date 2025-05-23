import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/useReports";
import ReportItem from "@/components/ReportItem";

interface ReportsListProps {
  onCreateReport: () => void;
}

export default function ReportsList({ onCreateReport }: ReportsListProps) {
  const { reports, isLoading } = useReports();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Reports</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin h-12 w-12 border-4 border-lemon-500 border-t-transparent rounded-full"></div>
        </div>
      ) : reports.length === 0 ? (
        // Empty state
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new vehicle health report.</p>
          <div className="mt-6">
            <Button 
              onClick={onCreateReport}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-lemon-500 hover:bg-lemon-600"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Create Report
            </Button>
          </div>
        </div>
      ) : (
        // Reports list
        <div className="space-y-6">
          {reports.map((report) => (
            <ReportItem key={report.id} report={report} />
          ))}
        </div>
      )}
    </div>
  );
}
