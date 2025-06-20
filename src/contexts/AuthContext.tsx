import { createContext, useEffect, useState, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";

interface User {
  id: string;
  username: string;
  email: string;
  token?: string;
  credits?: number;
}

interface AuthContextType {
  user: User | null;
  sessionId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithModal: () => void;
  logout: () => void;
  updateUserCredits: (credits: number) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { toast } = useToast();

  // Initialize session ID on load with 24 hour expiration
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedSessionId = localStorage.getItem("sessionId");
    const sessionExpiry = localStorage.getItem("sessionExpiry");
    
    const isSessionExpired = sessionExpiry && parseInt(sessionExpiry) < Date.now();
    
    // Check if user is logged in
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } 
    // Use the existing session ID if it's valid and not expired
    else if (storedSessionId && !isSessionExpired) {
      setSessionId(storedSessionId);
      console.log("Using existing session ID:", storedSessionId);
    } 
    // Get a new session ID if none exists or the current one is expired
    else {
      // For anonymous users, get a new session from the API only if needed
      setIsLoading(true);
      
      // Get a session from the LemonLens API
      apiRequest("GET", "/session")
        .then(async (response) => {
          const data = await response.json();
          
          // Get the exact UUID session_id from the API response
          const newSessionId = data.session_id;
          
          if (!newSessionId) {
            console.error("No session ID found in API response", data);
            throw new Error("No session ID in response");
          }
          
          // Set session ID with 24 hour expiration
          const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
          localStorage.setItem("sessionId", newSessionId);
          localStorage.setItem("sessionExpiry", expiryTime.toString());
          setSessionId(newSessionId);
          
          console.log("New session ID assigned from API:", newSessionId);
        })
        .catch(error => {
          console.error("Error creating session:", error);
          // If we can't get a session ID from the API, we'll need to try again later
          toast({
            title: "Session Error",
            description: "Could not create a session. Some features may be limited.",
            variant: "destructive"
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/auth/login", {
        email,
        password,
        session_id: sessionId // Include session_id for report migration
      });
      
      const data = await response.json();
      
      // Create a user object with the response data
      const userData = {
        id: data.user.id,
        username: data.user.name,
        email: data.user.email,
        token: data.token,
        credits: data.user.credits
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Clear session ID as we now have a user
      setSessionId(null);
      localStorage.removeItem("sessionId");
      localStorage.removeItem("sessionExpiry");
      
      // Invalidate reports cache to fetch user reports
      queryClient.invalidateQueries({ queryKey: ["/reports"] });
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/auth/register", {
        name: username, // API expects 'name' instead of 'username'
        email,
        password,
        password_confirmation: password,
        session_id: sessionId // Include session_id for report migration
      });
      
      const data = await response.json();
      
      // Create a user object with the response data
      const userData = {
        id: data.user.id,
        username: data.user.name,
        email: data.user.email,
        token: data.token,
        credits: data.user.credits
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Clear session ID as we now have a user
      setSessionId(null);
      localStorage.removeItem("sessionId");
      localStorage.removeItem("sessionExpiry");
      
      // Invalidate reports cache to fetch user reports
      queryClient.invalidateQueries({ queryKey: ["/reports"] });
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created!",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Unable to create your account. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      // Load the Google Identity library
      const loadScript = () => {
        return new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Google Identity library'));
          document.head.appendChild(script);
        });
      };
      
      await loadScript();
      
      // Initialize Google OAuth client
      // Use the provided Google Client ID directly in the code
      // In production, this should come from an environment variable
      const googleClientId = "255128454310-d08l2fcs6irdudgb0gi9v1o1h3nl9f0o.apps.googleusercontent.com";
      console.log("Using Google Client ID:", googleClientId);
      
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'email profile',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.access_token) {
            try {
              // Send the token to the LemonLens API using apiRequest
              const response = await apiRequest("POST", "/auth/google", {
                access_token: tokenResponse.access_token,
                session_id: sessionId || null
              });
              
              const data = await response.json();
              
              // Create a user object with the response data
              const userData = {
                id: data.user.id,
                username: data.user.name,
                email: data.user.email,
                token: data.token
              };
              
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
              
              // Clear session ID as we now have a user
              setSessionId(null);
              localStorage.removeItem("sessionId");
              localStorage.removeItem("sessionExpiry");
              
              // Invalidate reports cache to fetch user reports
              queryClient.invalidateQueries({ queryKey: ["/reports"] });
              
              toast({
                title: "Login Successful",
                description: "You've successfully logged in with Google!",
              });
            } catch (error) {
              console.error("Error authenticating with backend:", error);
              toast({
                title: "Login Failed",
                description: "Error authenticating with server. Please try again.",
                variant: "destructive",
              });
            }
          }
          setIsLoading(false);
        },
      });
      
      // Request an access token
      client.requestAccessToken();
      
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Login Failed",
        description: "Unable to login with Google. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }
  };

  const loginWithModal = () => {
    // Open login modal
    setLoginModalOpen(true);
  };

  const logout = () => {
    // If we have a user with a token, call the logout endpoint
    if (user?.token) {
      apiRequest("POST", "/auth/logout", {}, { 
        "Authorization": `Bearer ${user.token}`
      })
      .catch(error => {
        console.error("Error logging out:", error);
      });
    }
    
    // Clear user from state and localStorage
    setUser(null);
    localStorage.removeItem("user");
    
    // Create a new session by calling the API
    apiRequest("GET", "/session")
      .then(async (response) => {
        const data = await response.json();
        
        // Get the exact session_id from the API response
        const newSessionId = data.session_id;
        
        if (!newSessionId) {
          console.error("No session ID found in API response during logout", data);
          throw new Error("No session ID in logout response");
        }
        
        // Set session ID with 24 hour expiration
        const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
        localStorage.setItem("sessionId", newSessionId);
        localStorage.setItem("sessionExpiry", expiryTime.toString());
        setSessionId(newSessionId);
        console.log("New session ID assigned on logout from API:", newSessionId);
      })
      .catch(error => {
        console.error("Error creating session:", error);
        // If we can't get a session ID from the API, we'll need to try again later
        toast({
          title: "Session Error",
          description: "Could not create a session. Some features may be limited.",
          variant: "destructive"
        });
      });
    
    // Invalidate reports cache
    queryClient.invalidateQueries({ queryKey: ["/reports"] });
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUserCredits = (credits: number) => {
    if (user) {
      const updatedUser = { ...user, credits };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    sessionId,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    loginWithGoogle,
    loginWithModal,
    logout,
    updateUserCredits,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
