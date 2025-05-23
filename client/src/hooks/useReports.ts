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

  const { data: reportsResponse, isLoading, refetch } = useQuery<{reports: Report[]}>({
    queryKey: ["/reports"],
    // No need for a custom queryFn as our updated queryClient already handles
    // adding the auth token or session ID to the request
    enabled: !!user || !!sessionId,
  });
  
  // Extract reports from the response
  const reports = reportsResponse?.reports || [];

  const createMutation = useMutation({
    mutationFn: async (input: CreateReportInput) => {
      // Get the session_id from localStorage for anonymous users
      const sessionId = localStorage.getItem("sessionId");
      
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
    mutationFn: async (reportId: number) => {
      // No need to add query parameters as the auth token or session_id 
      // is automatically included in our request setup
      const response = await apiRequest("POST", `/reports/${reportId}/retry`);
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
