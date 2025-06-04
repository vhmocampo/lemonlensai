import { QueryClient, QueryFunction } from "@tanstack/react-query";

// LemonLens API base URL
// const API_BASE_URL = "https://lemonlensapp.com/api/v1";
const API_BASE_URL = "http://localhost:8000/api/v1";

// Add API key accessor for use throughout the application
export const getApiKey = () => process.env.VEHICLE_API_KEY || import.meta.env.VITE_VEHICLE_API_KEY || "";

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
  let token = null;
  
  // Safely parse the user data and extract token
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      token = userData.token;
      console.log("Using auth token for request", endpoint);
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }
  
  // Build full URL (ensure endpoint doesn't start with /)
  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  
  // Add session_id as query parameter if not authenticated and sessionId exists
  if (!token) {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}session_id=${sessionId}`;
    }
  }
  
  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...customHeaders
  };
  
  // Add API key authorization for all requests
  const apiKey = import.meta.env.VITE_VEHICLE_API_KEY;
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }
  
  // Add user authorization header if token exists (for authenticated user requests)
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log("Added user Authorization header for request", endpoint);
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
  async ({ queryKey }: { queryKey: any }) => {
    // Get key and params
    const [endpoint, params] = queryKey;
    
    // Get auth token from localStorage if available
    const userStr = localStorage.getItem("user");
    let token = null;
    
    // Safely parse the user data and extract token
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        token = userData.token;
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    
    // Build URL with query parameters
    let url = `${API_BASE_URL}${(endpoint as string).startsWith('/') ? endpoint : '/' + endpoint}`;
    
    // Add session_id as query parameter if not authenticated
    if (!token) {
      const sessionId = localStorage.getItem("sessionId");
      if (sessionId) {
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}session_id=${sessionId}`;
      }
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
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}${queryString}`;
      }
    }
    
    // Prepare headers
    const headers: Record<string, string> = {
      "Accept": "application/json"
    };
    
    // Add API key authorization for all requests
    const apiKey = import.meta.env.VITE_VEHICLE_API_KEY;
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }
    
    // Add user authorization header if token exists (for authenticated user requests)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log("Added user Authorization header for GET request", endpoint);
    }
    
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