import { useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Report } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

interface CreateReportInput {
  make: string;
  model: string;
  year: string;
  mileage: number;
  vin?: string;
}

export function useReports() {
  const { user, sessionId } = useAuth();
  
  // Determine the query parameters based on whether the user is logged in
  const queryParams = user 
    ? { userId: user.id } 
    : sessionId 
      ? { sessionId: sessionId }
      : null;

  // Build the query URL with session_id as a query parameter for anonymous users
  const reportUrl = user 
    ? "/reports" 
    : sessionId 
      ? `/reports?session_id=${sessionId}`
      : "/reports";
      
  const { data: reportsResponse, isLoading, refetch } = useQuery<Report[] | {reports: Report[]}>({
    queryKey: ["/reports", user?.id || sessionId],
    queryFn: async () => {
      const response = await apiRequest("GET", reportUrl);
      return response.json();
    },
    enabled: !!user || !!sessionId,
    // Add polling every 10 seconds to keep the reports list updated
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    // Add stale time to reduce unnecessary fetches when tab is visible
    staleTime: 5000,
  });
  
  // Extract reports from the response - handle API format
  // The API returns an array of report objects with different field names
  const reports = Array.isArray(reportsResponse) 
    ? reportsResponse.map(report => ({
        // Map API response fields to our schema
        id: 0, // Placeholder ID
        uuid: report.uuid,
        make: report.make,
        model: report.model,
        year: report.year,
        mileage: report.mileage,
        status: report.status,
        createdAt: report.created_at || null,
        updatedAt: report.updated_at || null,
        // Fields that might not be in the API response
        userId: null,
        sessionId: null,
        vin: null,
        result: report.result || {}
      }))
    : reportsResponse?.reports || [];

  const createMutation = useMutation({
    mutationFn: async (input: CreateReportInput) => {
      // Use the session ID from the context hook
      // No need to access localStorage directly
      
      // Create request payload
      const payload: any = {
        make: input.make,
        model: input.model,
        year: parseInt(input.year), // Convert to integer as required by API
        mileage: input.mileage,
      };
      
      // Add VIN if provided
      if (input.vin) {
        payload.vin = input.vin;
      }
      
      // Add session_id if user is not logged in - ensure we're using the exact format from the API
      if (!localStorage.getItem("user") && sessionId) {
        // The API requires the exact session_id in UUID format
        payload.session_id = sessionId;
        console.log("Creating report with session_id:", sessionId);
        
        // For debugging purposes - log the entire payload to ensure it's correct
        console.log("Full report payload:", JSON.stringify(payload));
      }
      
      // Include session_id directly in the request body as specified in the API docs
      const response = await apiRequest("POST", "/reports", payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/reports"] });
    },
  });

  const retryMutation = useMutation({
    mutationFn: async (reportId: string | number) => {
      // The report ID could be a UUID string from the API
      const response = await apiRequest("POST", `/reports/${reportId}/retry`, {
        // Include session_id for anonymous users
        ...(sessionId && !localStorage.getItem("user") ? { session_id: sessionId } : {})
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/reports"] });
    },
  });

  const createReport = useCallback(
    async (input: CreateReportInput) => {
      return createMutation.mutateAsync(input);
    },
    [createMutation]
  );

  const retryReport = useCallback(
    async (reportId: number) => {
      return retryMutation.mutateAsync(reportId);
    },
    [retryMutation]
  );

  return {
    reports,
    isLoading,
    isCreating: createMutation.isPending,
    isRetrying: retryMutation.isPending,
    createReport,
    retryReport,
    refetch,
  };
}
