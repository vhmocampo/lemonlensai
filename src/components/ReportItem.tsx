import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, Clock, AlertCircle, CheckCircle, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReports } from "@/hooks/useReports";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: number;
  uuid: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
  userId: string | null;
  sessionId: string | null;
  vin: string | null;
  result: any;
}

interface ReportItemProps {
  report: Report;
}

export default function ReportItem({ report }: ReportItemProps) {
  const [open, setOpen] = useState(false);
  const { retryReport, isRetrying } = useReports();
  const { toast } = useToast();

  const handleRetry = async () => {
    try {
      // Use uuid field if it exists (from API), otherwise use id (from local DB)
      const reportId = report.uuid || report.id.toString();
      await retryReport(reportId);
      toast({
        title: "Processing Restarted",
        description: "Your report is being processed again.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restart processing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | Date) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Just now';
    }
  };

  const getStatusBadge = () => {
    // Check if the report has a completed_at property or created_at field from API
    const isCompleted = report.result && Object.keys(report.result).length > 0;
    
    // Use the explicit status field with fallback logic
    const status = report.status || (isCompleted ? "completed" : "processing");
    
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="mr-1 h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        // For any unknown status, show as processing
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="mr-1 h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );
    }
  };

  return (
    <div className="bg-gray-50 shadow sm:rounded-lg overflow-hidden">
      <div 
        onClick={() => setOpen(!open)}
        className="px-4 py-5 sm:px-6 cursor-pointer"
      >
        {/* Mobile-first layout: Stack everything vertically on small screens */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg leading-6 font-medium text-gray-900 truncate">
              {report.make} {report.model} {report.year}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {formatDate(report.createdAt || '')}
            </p>
            {/* Display score and recommendation for completed reports */}
            {report.status === "completed" && report.result && (
              <div className="mt-2 flex flex-col gap-2">
                {report.result.score && (
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-500 mr-1">Score:</span>
                    <span className={`text-sm font-bold ${
                      report.result.score >= 80 ? 'text-green-600' : 
                      report.result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {report.result.score}/100
                    </span>
                  </div>
                )}
                {report.result.recommendation && (
                  <div className="flex items-start">
                    <span className="text-xs font-medium text-gray-500 mr-1 mt-0.5 flex-shrink-0">Recommendation:</span>
                    <span className="text-sm font-medium text-blue-700 break-words">
                      {report.result.recommendation}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Status and actions section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-3">
            <div className="flex items-center gap-2 order-2 sm:order-1">
              {getStatusBadge()}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs px-2 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/report/${report.uuid || report.id}`;
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
            <ChevronDown 
              className={`h-5 w-5 text-gray-500 transition-transform self-end sm:self-center order-1 sm:order-2 ${open ? 'transform rotate-180' : ''}`} 
            />
          </div>
        </div>
      </div>
      
      {open && (
        <div className="border-t border-gray-200">
          {report.status === "completed" && report.result && (
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">VEHICLE INFORMATION</h4>
                  <div className="mt-2 text-sm text-gray-900 space-y-1">
                    <p><span className="font-medium">Make:</span> {report.make}</p>
                    <p><span className="font-medium">Model:</span> {report.model}</p>
                    <p><span className="font-medium">Year:</span> {report.year}</p>
                    <p><span className="font-medium">Mileage:</span> {report.mileage.toLocaleString()} miles</p>
                    {report.vin && <p><span className="font-medium">VIN:</span> <span className="break-all">{report.vin}</span></p>}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">REPORT SUMMARY</h4>
                  <div className="mt-2">
                    {report.result && typeof report.result === 'object' && report.result.commonIssues && report.result.commonIssues.length > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium text-gray-500">Common Issues</span>
                          <span className="text-xs font-medium text-gray-500">Frequency</span>
                        </div>
                        <div className="space-y-2">
                          {report.result.commonIssues.map((issue: any, index: number) => (
                            <div key={index}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-700 truncate pr-2">{issue.name}</span>
                                <span className="text-sm text-gray-700 flex-shrink-0">{issue.frequency}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    issue.severity === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                                  }`} 
                                  style={{width: `${issue.frequency}%`}}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {report.result && typeof report.result === 'object' && report.result.suggestions && report.result.suggestions.length > 0 && (
                      <div className="mt-4">
                        <div className="text-xs font-medium text-gray-500 uppercase mb-2">Suggestions</div>
                        <div className="space-y-2">
                          {report.result.suggestions.map((suggestion: string, index: number) => (
                            <div key={index} className="flex items-start">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-gray-700 break-words">{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {report.result && typeof report.result === 'object' && report.result.findings && report.result.findings.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500">DETAILED FINDINGS</h4>
                  <div className="mt-2 space-y-4">
                    {report.result.findings.map((finding: any, index: number) => (
                      <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <h5 className="text-base md:text-lg font-medium text-gray-900 break-words">{finding.title}</h5>
                          <p className="mt-1 text-sm text-gray-600 break-words">{finding.description}</p>
                          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
                            <div className="flex items-center">
                              <AlertCircle className={`h-5 w-5 ${
                                finding.risk === 'medium' ? 'text-orange-500' : 'text-green-500'
                              }`} />
                              <span className="ml-1 text-sm text-gray-500">{
                                finding.risk === 'medium' ? 'Medium Risk' : 'Low Risk'
                              }</span>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium self-start ${
                              finding.risk === 'medium' 
                                ? 'bg-orange-100 text-orange-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {finding.action}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.result && typeof report.result === 'object' && report.result.maintenance && report.result.maintenance.length > 0 && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-500">RECOMMENDED MAINTENANCE</h4>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {report.result.maintenance.map((item: any, index: number) => (
                      <li key={index} className="py-3 flex flex-col sm:flex-row sm:justify-between gap-2">
                        <div className="flex items-start sm:items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="ml-2 text-sm text-gray-900 break-words">{item.item}</span>
                        </div>
                        <span className="text-sm text-gray-500 ml-7 sm:ml-0 flex-shrink-0">{item.interval}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {report.status === "processing" && (
            <div className="px-4 py-5 sm:p-6 text-center">
              <div className="animate-spin mx-auto h-10 w-10 text-yellow-500 border-4 border-current border-t-transparent rounded-full"></div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Processing Your Report</h3>
              <p className="mt-1 text-sm text-gray-500">This usually takes 1-2 minutes. You can close this page and check back later.</p>
            </div>
          )}
          
          {report.status === "failed" && (
            <div className="px-4 py-5 sm:p-6 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Report Generation Failed</h3>
              <p className="mt-1 text-sm text-gray-500">We couldn't generate your report. This could be due to insufficient data for your vehicle or a temporary system issue.</p>

            </div>
          )}
        </div>
      )}
    </div>
  );
}