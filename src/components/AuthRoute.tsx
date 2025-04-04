
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
  
  // Debug logging on mount and on any auth state change
  useEffect(() => {
    console.log("AuthRoute mounted/updated:", { 
      user: user?.email || "none", 
      isAuth: !!user,
      isLoading, 
      authInitialized,
      path: location.pathname,
      requireAdmin
    });
    
    return () => {
      console.log("AuthRoute unmounting from:", location.pathname);
    };
  }, [user, isLoading, authInitialized, location.pathname, requireAdmin]);

  // If auth is still initializing, show a simple loading state
  if (!authInitialized) {
    console.log("Auth not initialized yet, showing loading");
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green m-auto"></div>
          <p className="mt-4 text-golf-green">Initializing application...</p>
        </div>
      </div>
    );
  }
  
  // Auth is initialized but still loading
  if (isLoading) {
    console.log("Auth initialized but still loading");
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green m-auto"></div>
          <p className="mt-4 text-golf-green">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If user is not logged in, redirect to login
  if (!user) {
    console.log("User not authenticated, redirecting to login");
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
  console.log("Auth check passed, rendering protected content");
  return (
    <ErrorBoundary>
      <div data-testid="auth-route-content">
        {children}
      </div>
    </ErrorBoundary>
  );
};

export default AuthRoute;
