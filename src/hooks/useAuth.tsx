
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/api/authService';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';

export function useAuth() {
  // Use a ref for the initial state to avoid unnecessary re-renders
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  
  // Initialize auth state only once
  useEffect(() => {
    let isMounted = true;
    const initializeAuth = async () => {
      if (!isMounted) return;
      
      try {
        // Get user from localStorage
        const storedUser = getCurrentUser();
        
        // Only update state if the component is still mounted
        if (isMounted) {
          setUser(storedUser);
          setAuthInitialized(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        if (isMounted) {
          setUser(null);
          setAuthInitialized(true);
          setIsLoading(false);
        }
      }
    };
    
    initializeAuth();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await apiLogin({ email, password });
      
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
    apiLogout();
    setUser(null);
    navigate('/login');
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully."
    });
  }, [navigate]);
  
  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    user,
    isLoading,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    authInitialized
  }), [user, isLoading, login, logout, authInitialized]);
}
