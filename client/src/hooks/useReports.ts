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
    ? `?userId=${user.id}` 
    : sessionId 
      ? `?sessionId=${sessionId}` 
      : "";

  const { data: reports = [], isLoading, refetch } = useQuery<Report[]>({
    queryKey: ["/api/reports", queryParams],
    enabled: !!user || !!sessionId,
  });

  const createMutation = useMutation({
    mutationFn: async (input: CreateReportInput) => {
      const response = await apiRequest("POST", "/api/reports", {
        ...input,
        userId: user?.id,
        sessionId: !user ? sessionId : null,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
    },
  });

  const retryMutation = useMutation({
    mutationFn: async (reportId: number) => {
      const response = await apiRequest("POST", `/api/reports/${reportId}/retry`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
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
