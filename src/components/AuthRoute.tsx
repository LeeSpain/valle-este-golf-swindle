
import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface AuthRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isLoading, authInitialized } = useAuth();
  const location = useLocation();
  
  // Log auth state for debugging
  useEffect(() => {
    console.log("AuthRoute mount with:", { 
      user: user?.email || "none", 
      role: user?.role || "none",
      isLoading, 
      authInitialized,
      requireAdmin,
      pathname: location.pathname
    });
    
    return () => {
      console.log("AuthRoute unmounting", {
        user: user?.email || "none",
        pathname: location.pathname
      });
    };
  }, [user, isLoading, authInitialized, requireAdmin, location.pathname]);
  
  // Don't render anything until auth is initialized to prevent flashing
  if (!authInitialized) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green m-auto"></div>
          <p className="mt-4 text-golf-green">
            Initializing...
          </p>
        </div>
      </div>
    );
  }
  
  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green m-auto"></div>
          <p className="mt-4 text-golf-green">
            Loading...
          </p>
        </div>
      </div>
    );
  }
  
  // If user is not logged in, redirect to login
  if (!user) {
    console.log("AuthRoute: User not logged in, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // Check admin access if required
  if (requireAdmin && user.role !== 'admin') {
    console.log("AuthRoute: User is not admin, showing access denied");
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access this page. Admin privileges required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // User is authenticated, render children
  console.log("AuthRoute: User is authenticated, rendering children");
  return <>{children}</>;
};

export default AuthRoute;
