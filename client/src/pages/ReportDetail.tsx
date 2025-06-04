import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import {
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Info,
  CheckCircle,
  XCircle,
  Shield,
  DollarSign,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
        const sessionParam =
          !localStorage.getItem("user") && sessionId
            ? `?session_id=${sessionId}`
            : "";
        const response = await apiRequest(
          "GET",
          `/reports/${reportId}${sessionParam}`,
        );
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

  // Helper for score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Helper for score background
  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
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
        <p className="text-gray-500 mb-6">
          The report you're looking for doesn't exist or is no longer available.
        </p>
        <Button onClick={goBack}>Return to Dashboard</Button>
      </div>
    );
  }

  // Processing state
  if (!report.completed_at) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Button variant="ghost" size="sm" className="mb-6" onClick={goBack}>
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
              <Badge
                variant="outline"
                className="bg-yellow-100 text-yellow-800"
              >
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
                <p className="font-medium">
                  {report.mileage.toLocaleString()} mi
                </p>
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

  return (
    <TooltipProvider>
      <div className="container max-w-4xl mx-auto p-6">
        <Button variant="ghost" size="sm" className="mb-6" onClick={goBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
        </Button>

        {/* Header Card with Vehicle Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Vehicle Report</CardTitle>
                <CardDescription>
                  {report.make} {report.model} {report.year} •{" "}
                  {report.mileage.toLocaleString()} mi
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Complete
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Recommendation Card - Prominent Display */}
        {result.recommendation && (
          <Card className="mb-6 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl text-blue-700 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                Our Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 mb-4">
                {result.recommendation}
              </div>
              {result.summary && (
                <p className="text-gray-700 leading-relaxed">
                  {result.summary}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Score and Cost Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">

{/* Cost Estimates */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Repair Cost Ranges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Low end:</span>
                  <span className="font-bold text-green-600">
                    $
                    {result.cost_from ? result.cost_from.toLocaleString() : "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">High end:</span>
                  <span className="font-bold text-red-600">
                    ${result.cost_to ? result.cost_to.toLocaleString() : "0"}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-3 text-center">
                  Based on highest reported repairs. <br /> Upgrade for zip code
                  specific estimates.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reliability Score */}
          <Card className={`border-2 ${getScoreBg(result.score || 0)}`}>
            <CardHeader>
              <CardTitle className="text-lg">Reliability Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div
                className={`text-5xl font-bold ${getScoreColor(result.score || 0)} mb-2`}
              >
                {result.score || 0}
              </div>
              <div className="text-sm text-gray-600">out of 100</div>
            </CardContent>
          </Card>

        </div>

        {/* Known Issues and Recalls Section - Side by Side when both exist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Known Issues */}
          {result.known_issues && result.known_issues.length > 0 && (
            <Card className={`${!(result.recalls && result.recalls.length > 0) ? "md:col-span-2" : ""}`}>
              <CardHeader>
          <CardTitle className="text-xl">Known Issues</CardTitle>
          <CardDescription>
            Well-known issues with this vehicle model.
          </CardDescription>
              </CardHeader>
              <CardContent>
          <div className="space-y-3">
            {result.known_issues.map((issue: any, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
            issue.priority === 1
              ? "bg-red-50 border-red-200"
              : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-start">
            {issue.priority === 1 ? (
              <XCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            ) : (
              <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            )}
            <div>
              {issue.priority === 1 && (
                <Badge variant="destructive" className="mb-2">
                  Critical
                </Badge>
              )}
              <p
                className={
                  issue.priority === 1
              ? "text-red-800"
              : "text-gray-700"
                }
              >
                {issue.description}
              </p>
            </div>
                </div>
              </div>
            ))}
          </div>
              </CardContent>
            </Card>
          )}

          {/* Recalls */}
          {result.recalls && result.recalls.length > 0 && (
            <Card className={`${!(result.known_issues && result.known_issues.length > 0) ? "md:col-span-2" : ""}`}>
              <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Possible Recalls
          </CardTitle>
          <CardDescription>
            Possible recalls; always check with your dealer.
          </CardDescription>
              </CardHeader>
              <CardContent>
          <div className="space-y-3">
            {result.recalls.map((recall: any, index: number) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
            recall.priority === 1
              ? "bg-red-50 border-red-200"
              : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex items-start">
            {recall.priority === 1 ? (
              <XCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            ) : (
              <Shield className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            )}
            <div>
              {recall.priority === 1 && (
                <Badge variant="destructive" className="mb-2">
                  Critical
                </Badge>
              )}
              <p
                className={
                  recall.priority === 1
              ? "text-red-800"
              : "text-yellow-800"
                }
              >
                {recall.description}
              </p>
            </div>
                </div>
              </div>
            ))}
          </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Data Coverage Notice */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">
                  Report Coverage
                </p>
                <p className="text-blue-700">
                  Listed repairs are based on general trends and may not apply to your specific vehicle. 
                  <br />For detailed information unique to your car, consider upgrading to a premium report.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints Section */}
        {result.complaints && Object.keys(result.complaints).length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">
                Possible Repairs Needed Over Time
              </CardTitle>
              <CardDescription>
                These are based on broad user reports, and could vary per car.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(result.complaints).map(
                  ([key, complaint]: [string, any]) => (
                    <div
                      key={key}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-lg">
                          {complaint.normalized_title}
                        </h4>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            Cost at minimum
                          </div>
                          <div className="font-bold text-lg">
                            $
                            {complaint.average_cost
                              ? complaint.average_cost.toLocaleString()
                              : "N/A"}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">
                        {complaint.description}
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-gray-500 text-sm">
                            Mileage Range:{" "}
                          </span>
                          <span className="font-medium">
                            {complaint.bucket_from
                              ? complaint.bucket_from.toLocaleString()
                              : "0"}{" "}
                            -{" "}
                            {complaint.bucket_to
                              ? complaint.bucket_to.toLocaleString()
                              : "0"}{" "}
                            mi
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm">
                            Frequency:{" "}
                          </span>
                          <span className="font-medium">
                            {complaint.times_reported || "Not specified"}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded text-sm mb-3 flex items-center justify-between">
                        <span className="text-gray-500">
                          User report available on premium reports
                        </span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="cursor-help">
                              Premium Feature <Info className="ml-1 h-3 w-3" />
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Specific complaint details are only visible on
                              premium reports
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      {complaint.likelyhood !== undefined && (
                        <div className="flex items-center">
                          <span className="text-gray-500 text-sm mr-2">
                            Likelihood:{" "}
                          </span>
                          {complaint.likelyhood === null ? (
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge
                                  variant="outline"
                                  className="cursor-help"
                                >
                                  Premium Feature{" "}
                                  <Info className="ml-1 h-3 w-3" />
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Likelihood data is only visible on premium
                                  reports
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="font-medium">
                              {complaint.likelyhood}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Suggestions - Pro Tips */}
        {result.suggestions && result.suggestions.length > 0 && (
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg text-green-800">Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.suggestions.map((suggestion: any, index: number) => (
                  <div key={index} className="flex items-start text-green-700">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{suggestion}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Report Footer */}
        <Card>
          <CardFooter className="flex justify-between text-xs text-gray-500 pt-6">
            <div>Generated: {formatDate(report.completed_at)}</div>
            <div>Report ID: {report.uuid || reportId}</div>
          </CardFooter>
        </Card>

        {/* Data Source Disclaimer */}
        <div className="text-center mt-6 mb-4">
          <p className="text-xs text-gray-400">
            Data sourced from known repair sites, NHTSA complaints, popular
            online forums and JD Power
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}
