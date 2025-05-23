import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

export default function ReportDetail() {
  const { reportId } = useParams();
  const [location, setLocation] = useLocation();
  const { user, sessionId } = useAuth();
  const [pollingInterval, setPollingInterval] = useState<number>(5000); // 5 seconds default

  // Fetch report directly from API with polling
  const { data: report, isLoading } = useQuery({
    queryKey: ["/reports", reportId],
    queryFn: async () => {
      try {
        // Include session ID in query param for anonymous users
        const sessionParam = !localStorage.getItem("user") && sessionId ? `?session_id=${sessionId}` : '';
        const response = await apiRequest("GET", `/reports/${reportId}${sessionParam}`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching report:", error);
        return null;
      }
    },
    refetchInterval: pollingInterval,
    refetchIntervalInBackground: true,
    enabled: !!reportId,
  });

  // Update polling intervals based on completion status
  useEffect(() => {
    if (report?.completed_at) {
      setPollingInterval(0); // Stop polling when complete
      console.log("Report is complete, completed at:", report.completed_at);
    } else if (report?.created_at && !report?.completed_at) {
      setPollingInterval(2000); // Poll faster while processing
      console.log("Report is processing");
    } else {
      setPollingInterval(5000); // Default polling interval
      console.log("Report status unknown, using default polling");
    }
  }, [report?.completed_at, report?.created_at]);

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  // Return to reports list
  const goBack = () => {
    setLocation("/");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-yellow-500 mb-4" />
        <h3 className="text-xl font-medium">Loading report details...</h3>
      </div>
    );
  }

  // Error state
  if (!report) {
    return (
      <div className="container max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
        <h3 className="text-xl font-medium">Report not found</h3>
        <p className="text-gray-500 mb-6">The report you're looking for doesn't exist or is no longer available.</p>
        <Button onClick={goBack}>Return to Dashboard</Button>
      </div>
    );
  }

  // Processing state
  if (!report.completed_at) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6" 
          onClick={goBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Vehicle Report</CardTitle>
                <CardDescription>
                  {report.make} {report.model} {report.year}
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                Processing
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 text-center py-10">
              <Loader2 className="h-12 w-12 animate-spin text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium">Analyzing vehicle data</h3>
              <p className="text-gray-500">
                We're processing your report. This may take a few minutes.
              </p>
              <Progress
                value={report.status === "processing" ? 60 : 30}
                className="w-full max-w-md mx-auto mt-4"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Make</p>
                <p className="font-medium">{report.make}</p>
              </div>
              <div>
                <p className="text-gray-500">Model</p>
                <p className="font-medium">{report.model}</p>
              </div>
              <div>
                <p className="text-gray-500">Year</p>
                <p className="font-medium">{report.year}</p>
              </div>
              <div>
                <p className="text-gray-500">Mileage</p>
                <p className="font-medium">{report.mileage.toLocaleString()} mi</p>
              </div>
              {report.vin && (
                <div className="col-span-2">
                  <p className="text-gray-500">VIN</p>
                  <p className="font-medium">{report.vin}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between text-xs text-gray-500">
            <div>Created: {formatDate(report.created_at)}</div>
            <div>Report ID: {report.uuid || reportId}</div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Complete report display
  const result = report.result || {};
  
  // Extract result data with defaults
  const reliabilityScore = result.score || 0;
  const repairBuckets = result.repair_buckets || {};
  const commonIssues = repairBuckets.low || [];
  const moderateIssues = repairBuckets.moderate || [];
  const severeIssues = repairBuckets.severe || [];

  // Helper for score color
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-6" 
        onClick={goBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
      </Button>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Vehicle Report</CardTitle>
              <CardDescription>
                {report.make} {report.model} {report.year}
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
              {report.completed_at ? "Complete" : "Processing"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Vehicle Summary */}
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Make</p>
              <p className="font-medium">{report.make}</p>
            </div>
            <div>
              <p className="text-gray-500">Model</p>
              <p className="font-medium">{report.model}</p>
            </div>
            <div>
              <p className="text-gray-500">Year</p>
              <p className="font-medium">{report.year}</p>
            </div>
            <div>
              <p className="text-gray-500">Mileage</p>
              <p className="font-medium">{report.mileage.toLocaleString()} mi</p>
            </div>
            {report.vin && (
              <div className="col-span-2">
                <p className="text-gray-500">VIN</p>
                <p className="font-medium">{report.vin}</p>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Reliability Score */}
          <div className="flex flex-col items-center justify-center py-4">
            <h3 className="text-lg font-medium mb-2">Reliability Score</h3>
            <div className={`text-6xl font-bold ${getScoreColor(reliabilityScore)}`}>
              {reliabilityScore}
            </div>
            <p className="text-gray-500 text-sm mt-2">
              {reliabilityScore >= 75 
                ? "Excellent reliability with minimal issues expected" 
                : reliabilityScore >= 50 
                  ? "Average reliability with some maintenance required"
                  : "Below average reliability, consider thorough inspection"
              }
            </p>
          </div>
          
          {/* Category Distribution */}
          {result.category_counts && Object.keys(result.category_counts).length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-3">Issue Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(result.category_counts).map(([category, count], index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded-md text-center">
                    <div className="text-sm font-medium capitalize">{category.replace('_', ' ')}</div>
                    <div className="text-lg font-bold">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Priority Distribution */}
          {result.priority_counts && Object.keys(result.priority_counts).length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-3">Issue Priority Distribution</h3>
              <div className="flex space-x-4">
                {Object.entries(result.priority_counts).map(([priority, count], index) => (
                  <div key={index} 
                    className={`flex-1 p-3 rounded-md text-center ${
                      priority === 'low' 
                        ? 'bg-yellow-50 text-yellow-800' 
                        : priority === 'medium' 
                          ? 'bg-orange-50 text-orange-800' 
                          : 'bg-red-50 text-red-800'
                    }`}>
                    <div className="text-sm font-medium capitalize">{priority}</div>
                    <div className="text-xl font-bold">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Separator />
          
          {/* Issue Sections */}
          <div className="space-y-6">
            {/* Low Priority Issues */}
            {commonIssues && commonIssues.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="low-issues">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-2">⚠️</span>
                      <h3 className="text-lg font-medium">Common Issues ({commonIssues.length})</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {commonIssues.map((issue: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium">{issue.title}</h4>
                          {issue.category && (
                            <Badge variant="outline" className="mt-1 mb-2">
                              {issue.category}
                            </Badge>
                          )}
                          <p className="text-sm text-gray-600">{issue.description}</p>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {issue.median_cost && (
                              <div className="text-sm">
                                <span className="text-gray-500">Est. Cost: </span>
                                <span className="font-medium">${issue.median_cost.toFixed(2)}</span>
                              </div>
                            )}
                            {issue.estimated_cost && (
                              <div className="text-sm">
                                <span className="text-gray-500">Repair Cost: </span>
                                <span className="font-medium">${issue.estimated_cost.toFixed(2)}</span>
                              </div>
                            )}
                            {issue.average_mileage && (
                              <div className="text-sm">
                                <span className="text-gray-500">Avg. Mileage: </span>
                                <span className="font-medium">{issue.average_mileage.toLocaleString()}</span>
                              </div>
                            )}
                            {issue.confidence_score && (
                              <div className="text-sm">
                                <span className="text-gray-500">Confidence: </span>
                                <span className="font-medium">{(issue.confidence_score * 100).toFixed(0)}%</span>
                              </div>
                            )}
                          </div>
                          {issue.complaint_title && (
                            <div className="mt-3 p-2 bg-gray-100 rounded text-sm italic">
                              <span className="font-medium">Related complaint: </span>
                              {issue.complaint_title}
                            </div>
                          )}
                          {issue.estimated_cost_low && issue.estimated_cost_high && (
                            <div className="mt-2 text-xs text-gray-500">
                              Cost range: ${issue.estimated_cost_low.toFixed(2)} - ${issue.estimated_cost_high.toFixed(2)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            
            {/* Moderate Issues */}
            {moderateIssues && moderateIssues.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="moderate-issues">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center">
                      <span className="text-orange-500 mr-2">🔶</span>
                      <h3 className="text-lg font-medium">Moderate Issues ({moderateIssues.length})</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {moderateIssues.map((issue: any, index: number) => (
                        <div key={index} className="bg-orange-50 p-4 rounded-lg">
                          <h4 className="font-medium">{issue.title}</h4>
                          {issue.category && (
                            <Badge variant="outline" className="mt-1 mb-2">
                              {issue.category}
                            </Badge>
                          )}
                          <p className="text-sm text-gray-600">{issue.description}</p>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {issue.median_cost && (
                              <div className="text-sm">
                                <span className="text-gray-500">Est. Cost: </span>
                                <span className="font-medium">${issue.median_cost.toFixed(2)}</span>
                              </div>
                            )}
                            {issue.estimated_cost && (
                              <div className="text-sm">
                                <span className="text-gray-500">Repair Cost: </span>
                                <span className="font-medium">${issue.estimated_cost.toFixed(2)}</span>
                              </div>
                            )}
                            {issue.average_mileage && (
                              <div className="text-sm">
                                <span className="text-gray-500">Avg. Mileage: </span>
                                <span className="font-medium">{issue.average_mileage.toLocaleString()}</span>
                              </div>
                            )}
                            {issue.confidence_score && (
                              <div className="text-sm">
                                <span className="text-gray-500">Confidence: </span>
                                <span className="font-medium">{(issue.confidence_score * 100).toFixed(0)}%</span>
                              </div>
                            )}
                          </div>
                          {issue.complaint_title && (
                            <div className="mt-3 p-2 bg-orange-100 rounded text-sm italic">
                              <span className="font-medium">Related complaint: </span>
                              {issue.complaint_title}
                            </div>
                          )}
                          {issue.estimated_cost_low && issue.estimated_cost_high && (
                            <div className="mt-2 text-xs text-gray-500">
                              Cost range: ${issue.estimated_cost_low.toFixed(2)} - ${issue.estimated_cost_high.toFixed(2)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            
            {/* Severe Issues */}
            {severeIssues && severeIssues.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="severe-issues">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">🔴</span>
                      <h3 className="text-lg font-medium">Critical Issues ({severeIssues.length})</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {severeIssues.map((issue: any, index: number) => (
                        <div key={index} className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-medium">{issue.title}</h4>
                          {issue.category && (
                            <Badge variant="outline" className="mt-1 mb-2">
                              {issue.category}
                            </Badge>
                          )}
                          <p className="text-sm text-gray-600">{issue.description}</p>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {issue.median_cost && (
                              <div className="text-sm">
                                <span className="text-gray-500">Est. Cost: </span>
                                <span className="font-medium">${issue.median_cost.toFixed(2)}</span>
                              </div>
                            )}
                            {issue.estimated_cost && (
                              <div className="text-sm">
                                <span className="text-gray-500">Repair Cost: </span>
                                <span className="font-medium">${issue.estimated_cost.toFixed(2)}</span>
                              </div>
                            )}
                            {issue.average_mileage && (
                              <div className="text-sm">
                                <span className="text-gray-500">Avg. Mileage: </span>
                                <span className="font-medium">{issue.average_mileage.toLocaleString()}</span>
                              </div>
                            )}
                            {issue.confidence_score && (
                              <div className="text-sm">
                                <span className="text-gray-500">Confidence: </span>
                                <span className="font-medium">{(issue.confidence_score * 100).toFixed(0)}%</span>
                              </div>
                            )}
                          </div>
                          {issue.complaint_title && (
                            <div className="mt-3 p-2 bg-red-100 rounded text-sm italic">
                              <span className="font-medium">Related complaint: </span>
                              {issue.complaint_title}
                            </div>
                          )}
                          {issue.estimated_cost_low && issue.estimated_cost_high && (
                            <div className="mt-2 text-xs text-gray-500">
                              Cost range: ${issue.estimated_cost_low.toFixed(2)} - ${issue.estimated_cost_high.toFixed(2)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-gray-500">
          <div>Updated: {formatDate(report.completed_at || report.created_at)}</div>
          <div>Report ID: {report.uuid || reportId}</div>
        </CardFooter>
      </Card>
    </div>
  );
}