import { QueryClient, QueryFunction } from "@tanstack/react-query";

// LemonLens API base URL
const API_BASE_URL = "https://lemonlensapp.com/api/v1";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown | undefined,
  customHeaders: Record<string, string> = {}
): Promise<Response> {
  // Get auth token from localStorage if available
  const userStr = localStorage.getItem("user");
  const token = userStr ? JSON.parse(userStr).token : null;
  
  // Build full URL (ensure endpoint doesn't start with /)
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-API-KEY": import.meta.env.VITE_VEHICLE_API_KEY || "",
    ...customHeaders
  };
  
  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get key and params
    const [endpoint, params] = queryKey;
    
    // Get auth token from localStorage if available
    const userStr = localStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr).token : null;
    
    // Get session ID from localStorage if available and not authenticated
    const sessionId = !token ? localStorage.getItem("sessionId") : null;
    
    // Build URL with query parameters
    let url = `${API_BASE_URL}${(endpoint as string).startsWith('/') ? endpoint : '/' + endpoint}`;
    
    // Add session_id as query parameter if available
    if (sessionId && !url.includes('?')) {
      url += `?session_id=${sessionId}`;
    } else if (sessionId) {
      url += `&session_id=${sessionId}`;
    }
    
    // Add additional query parameters if provided
    if (params && typeof params === 'object') {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      const queryString = searchParams.toString();
      if (queryString) {
        url += url.includes('?') ? `&${queryString}` : `?${queryString}`;
      }
    }
    
    // Prepare headers
    const headers: Record<string, string> = {
      "Accept": "application/json"
    };
    
    // Add authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Always include API key for LemonLens API
    headers["X-API-KEY"] = import.meta.env.VITE_VEHICLE_API_KEY || "";
    
    const res = await fetch(url, {
      headers
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
