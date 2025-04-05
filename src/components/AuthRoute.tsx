
import React, { ReactNode, memo, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface AuthRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

// Memoize the component to prevent unnecessary re-renders
const AuthRoute: React.FC<AuthRouteProps> = memo(({ children, requireAdmin = false }) => {
  const { user, isLoading, authInitialized } = useAuth();
  
  // Log render for debugging
  useEffect(() => {
    console.log("AuthRoute rendered with:", { 
      user: user?.email, 
      isLoading, 
      authInitialized, 
      requireAdmin
    });
  }, [user, isLoading, authInitialized, requireAdmin]);
  
  // If auth is still initializing, show a loading state
  if (!authInitialized || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
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
    return <Navigate to="/login" replace />;
  }
  
  // Check admin access if required
  if (requireAdmin && user.role !== 'admin') {
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
  return <>{children}</>;
});

// Explicitly set display name for React DevTools and debugging
AuthRoute.displayName = 'AuthRoute';

export default AuthRoute;
