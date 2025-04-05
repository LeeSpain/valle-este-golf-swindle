
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/api/authService';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';

export function useAuth() {
  // Use refs to track mounting state and prevent state updates after unmount
  const isMountedRef = useRef(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  
  // Initialize auth state only once
  useEffect(() => {
    console.log("useAuth: initializing auth state");
    
    // Get user from localStorage synchronously to prevent flicker
    try {
      const storedUser = getCurrentUser();
      if (isMountedRef.current) {
        setUser(storedUser);
        setIsLoading(false);
        setAuthInitialized(true);
      }
    } catch (error) {
      console.error("Error during auth initialization:", error);
      if (isMountedRef.current) {
        setUser(null);
        setIsLoading(false);
        setAuthInitialized(true);
      }
    }
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      console.log("useAuth: cleanup");
      isMountedRef.current = false;
    };
  }, []);
  
  // Login function
  const login = useCallback(async (email: string, password: string) => {
    if (!isMountedRef.current) return false;
    
    setIsLoading(true);
    
    try {
      const response = await apiLogin({ email, password });
      
      // Update user state only if still mounted
      if (isMountedRef.current) {
        setUser(response.user);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.user.email}!`
        });
        
        // Navigate to appropriate page based on role
        const destination = response.user.role === 'admin' ? '/admin' : '/';
        navigate(destination, { replace: true });
      }
      
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      
      if (isMountedRef.current) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive"
        });
      }
      
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [navigate]);
  
  const logout = useCallback(() => {
    apiLogout();
    if (isMountedRef.current) {
      setUser(null);
      navigate('/login');
      
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully."
      });
    }
  }, [navigate]);
  
  // Create a stable return value that never changes its shape
  return useMemo(() => ({
    user,
    isLoading,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    authInitialized
  }), [user, isLoading, login, logout, authInitialized]);
}
