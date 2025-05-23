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
}

interface AuthContextType {
  user: User | null;
  sessionId: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithModal: () => void;
  logout: () => void;
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

  // Initialize session ID on load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedSessionId = localStorage.getItem("sessionId");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (!storedSessionId) {
      // Create a new session if we don't have a user or session ID
      setIsLoading(true);
      
      // Get a new session from the LemonLens API
      apiRequest("GET", "/session")
        .then(async (response) => {
          const data = await response.json();
          const newSessionId = data.session_id;
          localStorage.setItem("sessionId", newSessionId);
          setSessionId(newSessionId);
        })
        .catch(error => {
          console.error("Error creating session:", error);
          // Fallback to a local session ID if API fails
          const localSessionId = nanoid();
          localStorage.setItem("sessionId", localSessionId);
          setSessionId(localSessionId);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSessionId(storedSessionId);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/auth/login", {
        email,
        password
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
      const response = await apiRequest("POST", "auth/register", {
        name: username, // API expects 'name' instead of 'username'
        email,
        password,
        password_confirmation: password
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
      // In a real implementation, this would redirect to Google OAuth
      toast({
        title: "Google Login Not Implemented",
        description: "This feature would be implemented with a real OAuth service.",
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Unable to login with Google. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithModal = () => {
    // Open login modal
    setLoginModalOpen(true);
  };

  const logout = () => {
    // If we have a user with a token, call the logout endpoint
    if (user?.token) {
      apiRequest("POST", "auth/logout", {}, { 
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
    apiRequest("GET", "session")
      .then(async (response) => {
        const data = await response.json();
        const newSessionId = data.session_id;
        localStorage.setItem("sessionId", newSessionId);
        setSessionId(newSessionId);
      })
      .catch(error => {
        console.error("Error creating session:", error);
        // Fallback to a local session ID if API fails
        const localSessionId = nanoid();
        localStorage.setItem("sessionId", localSessionId);
        setSessionId(localSessionId);
      });
    
    // Invalidate reports cache
    queryClient.invalidateQueries({ queryKey: ["/reports"] });
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    user,
    sessionId,
    isLoading,
    login,
    register,
    loginWithGoogle,
    loginWithModal,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
