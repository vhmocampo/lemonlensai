import { useState } from "react";
import { Report } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, Clock, AlertCircle, CheckCircle, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReports } from "@/hooks/useReports";
import { useToast } from "@/hooks/use-toast";

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
      const reportId = report.uuid || report.id;
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
    const isCompleted = report.completed_at || report.created_at ? true : false;
    
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
        className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer"
      >
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {report.make} {report.model} {report.year}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Report #{report.id} • {formatDate(report.createdAt)}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge()}
          <div className="flex items-center space-x-2 mr-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
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
            className={`h-5 w-5 text-gray-500 transition-transform ${open ? 'transform rotate-180' : ''}`} 
          />
        </div>
      </div>
      
      {open && (
        <div className="border-t border-gray-200">
          {report.status === "completed" && report.result && (
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">VEHICLE INFORMATION</h4>
                  <div className="mt-2 text-sm text-gray-900">
                    <p><span className="font-medium">Make:</span> {report.make}</p>
                    <p><span className="font-medium">Model:</span> {report.model}</p>
                    <p><span className="font-medium">Year:</span> {report.year}</p>
                    <p><span className="font-medium">Mileage:</span> {report.mileage.toLocaleString()} miles</p>
                    {report.vin && <p><span className="font-medium">VIN:</span> {report.vin}</p>}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">REPORT SUMMARY</h4>
                  <div className="mt-2">
                    {report.result && typeof report.result === 'object' && report.result.overallHealth ? (
                      <div className="flex items-center">
                        <div className="w-2/5">
                          <div className="text-xs font-medium text-gray-500 uppercase">Overall Health</div>
                          <div className="mt-1 flex items-center">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-green-500 rounded-full" style={{width: `${report.result.overallHealth}%`}}></div>
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-900">{report.result.overallHealth}%</span>
                          </div>
                        </div>
                        <div className="w-3/5 pl-4">
                          <div className="text-xs font-medium text-gray-500 uppercase">Reliability Score</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {report.result.reliabilityScore ? `${report.result.reliabilityScore}/5.0` : 'N/A'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Detailed results not available</div>
                    )}
                    
                    {report.result && typeof report.result === 'object' && report.result.commonIssues && report.result.commonIssues.length > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium text-gray-500">Common Issues</span>
                          <span className="text-xs font-medium text-gray-500">Frequency</span>
                        </div>
                        {report.result.commonIssues.map((issue, index) => (
                          <div key={index} className="mb-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-700">{issue.name}</span>
                              <span className="text-sm text-gray-700">{issue.frequency}%</span>
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
                    )}
                  </div>
                </div>
              </div>

              {report.result && typeof report.result === 'object' && report.result.findings && report.result.findings.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500">DETAILED FINDINGS</h4>
                  <div className="mt-2 space-y-4">
                    {report.result.findings.map((finding, index) => (
                      <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <h5 className="text-lg font-medium text-gray-900">{finding.title}</h5>
                          <p className="mt-1 text-sm text-gray-600">{finding.description}</p>
                          <div className="mt-4 flex items-center">
                            <AlertCircle className={`h-5 w-5 ${
                              finding.risk === 'medium' ? 'text-orange-500' : 'text-green-500'
                            }`} />
                            <span className="ml-1 text-sm text-gray-500">{
                              finding.risk === 'medium' ? 'Medium Risk' : 'Low Risk'
                            }</span>
                            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
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
                    {report.result.maintenance.map((item, index) => (
                      <li key={index} className="py-3 flex justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="ml-2 text-sm text-gray-900">{item.item}</span>
                        </div>
                        <span className="text-sm text-gray-500">{item.interval}</span>
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
              <div className="mt-6">
                <Button 
                  onClick={handleRetry}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  disabled={isRetrying}
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
                      Retry Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}