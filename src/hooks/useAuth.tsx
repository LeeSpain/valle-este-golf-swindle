
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/api/authService';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';

export function useAuth() {
  // Use refs to track mounting state and prevent state updates after unmount
  const isMountedRef = useRef(true);
  
  // Initial user state from localStorage to prevent flicker
  const initialUser = useMemo(() => {
    try {
      return getCurrentUser();
    } catch (error) {
      console.error("Error getting initial user:", error);
      return null;
    }
  }, []);
  
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(true);
  const navigate = useNavigate();
  
  // Make sure we don't update state after unmount
  useEffect(() => {
    console.log("useAuth: initializing with user:", initialUser?.email || "none");
    isMountedRef.current = true;
    
    return () => {
      console.log("useAuth: cleanup");
      isMountedRef.current = false;
    };
  }, [initialUser]);
  
  // Login function - memoized to maintain stable reference
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
  
  // Logout function - memoized to maintain stable reference
  const logout = useCallback(() => {
    apiLogout();
    if (isMountedRef.current) {
      setUser(null);
      navigate('/login', { replace: true });
      
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully."
      });
    }
  }, [navigate]);
  
  // Create a stable return value that never changes its shape
  const authContext = useMemo(() => ({
    user,
    isLoading,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    authInitialized
  }), [user, isLoading, login, logout, authInitialized]);
  
  return authContext;
}
