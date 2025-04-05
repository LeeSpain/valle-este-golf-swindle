
import React, { ReactNode, memo, useEffect, useState, useRef } from 'react';
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
  
  // Use ref to track component mounted state
  const isMountedRef = useRef(true);
  
  // Add a local loading state to prevent flashing
  const [renderContent, setRenderContent] = useState(false);
  
  // Only render content after a brief delay to prevent flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setRenderContent(true);
      }
    }, 100); // Increased delay
    
    return () => {
      clearTimeout(timer);
      isMountedRef.current = false;
    };
  }, []);
  
  // Debug logging to track component lifecycle
  useEffect(() => {
    console.log("AuthRoute rendered with:", { 
      userEmail: user?.email, 
      isLoading, 
      authInitialized, 
      requireAdmin,
      renderContent,
      isMounted: isMountedRef.current
    });
    
    return () => {
      console.log("AuthRoute unmounted");
      isMountedRef.current = false;
    };
  }, [user, isLoading, authInitialized, requireAdmin, renderContent]);
  
  // Don't render anything until auth is initialized
  if (!authInitialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green m-auto"></div>
          <p className="mt-4 text-golf-green">
            Initializing...
          </p>
        </div>
      </div>
    );
  }
  
  // Don't render content until our local state says we're ready
  if (!renderContent) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green m-auto"></div>
          <p className="mt-4 text-golf-green">
            Preparing content...
          </p>
        </div>
      </div>
    );
  }
  
  // If still loading, show a loading state
  if (isLoading) {
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
    console.log("User not authenticated, redirecting to login");
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
  console.log("AuthRoute rendering children for user:", user.email);
  return <>{children}</>;
});

// Explicitly set display name for React DevTools and debugging
AuthRoute.displayName = 'AuthRoute';

export default AuthRoute;
