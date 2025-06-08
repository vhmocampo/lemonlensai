import { useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

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

interface CreateReportInput {
  make: string;
  model: string;
  year: string;
  mileage: number;
  vin?: string;
  zipCode?: string;
  additionalInfo?: string;
}

export function useReports() {
  const { user, sessionId } = useAuth();
  
  // Determine the query parameters based on whether the user is logged in
  const queryParams = user 
    ? { userId: user.id } 
    : sessionId 
      ? { sessionId: sessionId }
      : null;

  // Use query parameters for session handling
  const { data: reportsResponse, isLoading, refetch } = useQuery<any[]>({
    queryKey: ["/reports", user?.id || sessionId],
    queryFn: async () => {
      // Pass session_id as query parameter if not authenticated
      const params = sessionId && !user ? { session_id: sessionId } : undefined;
      const response = await apiRequest("GET", "/reports", undefined, params);
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
  const reports: Report[] = Array.isArray(reportsResponse) 
    ? reportsResponse.map((apiReport: any) => ({
        // Map API response fields to our schema
        id: 0, // Placeholder ID
        uuid: apiReport.uuid,
        make: apiReport.make,
        model: apiReport.model,
        year: apiReport.year,
        mileage: apiReport.mileage,
        status: apiReport.status,
        createdAt: apiReport.created_at || apiReport.createdAt || null,
        updatedAt: apiReport.updated_at || apiReport.updatedAt || null,
        // Fields that might not be in the API response
        userId: null,
        sessionId: null,
        type: apiReport.type || "standard", // Default to "vehicle" if not specified
        result: apiReport.result || {}
      }))
    : [];

  const createMutation = useMutation({
    mutationFn: async (input: CreateReportInput) => {
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
      
      // Add zipCode if provided
      if (input.zipCode) {
        payload.zipCode = input.zipCode;
      }
      
      // Add additionalInfo if provided
      if (input.additionalInfo) {
        payload.additionalInfo = input.additionalInfo;
      }
      
      // Add session_id if user is not logged in
      if (!user && sessionId) {
        payload.session_id = sessionId;
        console.log("Creating report with session_id:", sessionId);
      }
      
      const response = await apiRequest("POST", "/reports", payload);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/reports"] });
    },
  });

  const retryMutation = useMutation({
    mutationFn: async (reportId: string | number) => {
      const payload = !user && sessionId ? { session_id: sessionId } : {};
      const response = await apiRequest("POST", `/reports/${reportId}/retry`, payload);
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
    async (reportId: string | number) => {
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
