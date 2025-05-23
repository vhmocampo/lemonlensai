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
      // LemonLens API will use the auth token or session_id from our request setup
      const response = await apiRequest("POST", "/reports", {
        make: input.make,
        model: input.model,
        year: input.year,
        mileage: input.mileage,
        vin: input.vin || undefined,
      });
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
