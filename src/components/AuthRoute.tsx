
import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface AuthRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isLoading, authInitialized } = useAuth();
  const location = useLocation();
  
  // Debug logging for the current auth state
  useEffect(() => {
    console.log("AuthRoute render state:", { 
      path: location.pathname,
      user: user?.email || "none", 
      isAuth: !!user,
      isLoading, 
      authInitialized,
      requireAdmin
    });
  }, [user, isLoading, authInitialized, location.pathname, requireAdmin]);
  
  // If auth is still initializing, show a loading state
  if (!authInitialized || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green m-auto"></div>
          <p className="mt-4 text-golf-green">
            {!authInitialized ? "Initializing application..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }
  
  // If user is not logged in, redirect to login
  if (!user) {
    console.log("User not authenticated, redirecting to login from:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check admin access if required
  if (requireAdmin && user.role !== 'admin') {
    console.log("User doesn't have admin access");
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
  console.log("Auth check passed, rendering protected content for:", user.email);
  return (
    <ErrorBoundary>
      <div data-testid="auth-route-content">
        {children}
      </div>
    </ErrorBoundary>
  );
};

export default AuthRoute;
