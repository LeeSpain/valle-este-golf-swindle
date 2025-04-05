
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/api/authService';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const initRef = useRef(false);
  
  // Initialize auth state only once on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (initRef.current) return; // Prevent double initialization
      
      console.log("Auth hook initializing...");
      initRef.current = true;
      setIsLoading(true);
      
      try {
        // Get user from localStorage on initial load
        const storedUser = getCurrentUser();
        console.log("User from localStorage:", storedUser);
        
        // Set user state from localStorage
        setUser(storedUser);
      } catch (error) {
        console.error("Error during auth initialization:", error);
        setUser(null);
      } finally {
        // Always mark initialization as complete and loading as done
        setAuthInitialized(true);
        setIsLoading(false);
        console.log("Auth initialization complete");
      }
    };
    
    initializeAuth();
  }, []);
  
  // Login function
  const login = useCallback(async (email: string, password: string) => {
    console.log("Login attempt for:", email);
    setIsLoading(true);
    
    try {
      const response = await apiLogin({ email, password });
      console.log("Login successful for:", response.user.email);
      
      // Update user state
      setUser(response.user);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.user.email}!`
      });
      
      // Get the redirect path from location state or default to home
      const from = location.state?.from?.pathname || (response.user.role === 'admin' ? '/admin' : '/');
      navigate(from, { replace: true });
      
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, location]);
  
  const logout = useCallback(() => {
    console.log("User explicitly logging out");
    apiLogout();
    setUser(null);
    
    // Reset initialization state
    initRef.current = false;
    setAuthInitialized(false);
    
    navigate('/login');
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully."
    });
  }, [navigate]);
  
  return {
    user,
    isLoading,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    authInitialized
  };
}
