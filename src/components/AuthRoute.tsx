
import React, { ReactNode, useState, useEffect } from 'react';
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [renderCount, setRenderCount] = useState(0);

  // Log each render of this component to diagnose issues
  useEffect(() => {
    console.log(`AuthRoute render #${renderCount + 1}`, { 
      user: user?.email, 
      isLoading, 
      path: location.pathname,
      requireAdmin,
      authInitialized,
      authError
    });
    setRenderCount(prev => prev + 1);
  });
  
  useEffect(() => {
    console.log("AuthRoute mounted", { 
      user: user?.email, 
      isLoading, 
      path: location.pathname,
      requireAdmin,
      authInitialized
    });
    
    return () => {
      console.log("AuthRoute unmounted");
    };
  }, [user, isLoading, location.pathname, requireAdmin, authInitialized]);

  // Handle errors that might occur during auth checking
  useEffect(() => {
    try {
      if (requireAdmin && user && user.role !== 'admin') {
        setAuthError("You don't have permission to access this page. Admin privileges required.");
      } else {
        setAuthError(null);
      }
    } catch (err) {
      console.error("Error in AuthRoute permission checking:", err);
      setAuthError("Authentication error occurred. Please try refreshing.");
    }
  }, [user, requireAdmin]);

  // Show loading state if auth isn't initialized yet
  if (isLoading || !authInitialized) {
    console.log("AuthRoute showing loading state", { isLoading, authInitialized });
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green m-auto"></div>
          <p className="mt-4 text-golf-green">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show auth error if any
  if (authError) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Alert variant="destructive" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Proper auth checks
  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    console.log("User doesn't have admin privileges, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("AuthRoute rendering children - user authenticated properly");
  return (
    <ErrorBoundary>
      <div data-testid="auth-route-content">
        {children}
      </div>
    </ErrorBoundary>
  );
};

export default AuthRoute;
