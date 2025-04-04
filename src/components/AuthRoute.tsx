
import React, { ReactNode } from 'react';
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
  
  // Log auth state on render for debugging
  console.log("AuthRoute rendering:", { 
    user: user?.email || "none", 
    authInitialized, 
    isLoading,
    path: location.pathname
  });
  
  // Show loading state if auth is still initializing
  if (isLoading || !authInitialized) {
    console.log("AuthRoute: Still loading auth state");
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green m-auto"></div>
          <p className="mt-4 text-golf-green">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // Check if user is logged in
  if (!user) {
    console.log("AuthRoute: User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if admin access is required
  if (requireAdmin && user.role !== 'admin') {
    console.log("AuthRoute: User doesn't have admin privileges");
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
  
  // User is authenticated properly, render the children
  console.log("AuthRoute: Authentication successful, rendering children");
  return (
    <ErrorBoundary>
      <div data-testid="auth-route-content">
        {children}
      </div>
    </ErrorBoundary>
  );
};

export default AuthRoute;
