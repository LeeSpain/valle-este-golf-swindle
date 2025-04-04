
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, logout as apiLogout, getCurrentUser, isAdmin } from '@/api/authService';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("useAuth hook initialized with user:", user);
    
    // Check if we have a user in localStorage that isn't in state
    const storedUser = getCurrentUser();
    if (!user && storedUser) {
      console.log("Restoring user from localStorage:", storedUser);
      setUser(storedUser);
    }
  }, [user]);
  
  const login = async (email: string, password: string) => {
    console.log("Login attempt for:", email);
    setIsLoading(true);
    try {
      const response = await apiLogin({ email, password });
      setUser(response.user);
      
      console.log("Login successful for:", response.user.email);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${response.user.email}!`
      });
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      
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
  };
  
  const logout = () => {
    console.log("Logging out user");
    apiLogout();
    setUser(null);
    navigate('/login');
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully."
    });
  };
  
  return {
    user,
    isLoading,
    isAdmin: isAdmin(),
    login,
    logout
  };
}
