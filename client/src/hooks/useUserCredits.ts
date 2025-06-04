import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { apiRequest } from "@/lib/queryClient";

interface UserResponse {
  id: string;
  name: string;
  email: string;
  credits: number;
}

export function useUserCredits() {
  const { user, updateUserCredits } = useAuth();

  return useQuery({
    queryKey: ["/me"],
    queryFn: async (): Promise<UserResponse> => {
      const response = await apiRequest("GET", "/me");
      const data = await response.json();
      
      // Update credits in auth context when we get new data
      if (data.credits !== undefined) {
        updateUserCredits(data.credits);
      }
      
      return data;
    },
    enabled: !!user, // Only run when user is authenticated
    refetchInterval: 30000, // Poll every 30 seconds
    refetchIntervalInBackground: true, // Continue polling in background
    staleTime: 0, // Always consider data stale to ensure fresh credits
  });
}
