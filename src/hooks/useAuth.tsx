
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/api/authService';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  const initializationAttempted = useRef(false);
  
  // Initialize auth state - only run once
  useEffect(() => {
    // Skip if we've already attempted initialization
    if (initializationAttempted.current) return;
    
    const initializeAuth = async () => {
      console.log("Auth hook initializing...");
      initializationAttempted.current = true;
      
      try {
        // Get user from localStorage
        const storedUser = getCurrentUser();
        console.log("User from localStorage:", storedUser);
        
        // Set user state from localStorage
        setUser(storedUser);
      } catch (error) {
        console.error("Error during auth initialization:", error);
        setUser(null);
      } finally {
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
      
      // Navigate to appropriate page based on role
      const destination = response.user.role === 'admin' ? '/admin' : '/';
      navigate(destination, { replace: true });
      
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
  }, [navigate]);
  
  const logout = useCallback(() => {
    console.log("User explicitly logging out");
    apiLogout();
    setUser(null);
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
