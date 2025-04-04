
import React, { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth(); // Changed 'loading' to 'isLoading' to match useAuth hook
  const location = useLocation();
  const [showingContent, setShowingContent] = useState(false);

  useEffect(() => {
    // Set a timeout to show content even if auth is taking too long
    // This prevents the app from being stuck in a loading state
    const timer = setTimeout(() => {
      setShowingContent(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // For development purposes, temporarily bypass authentication checks if auth is taking too long
  if ((isLoading && !showingContent) || (!user && isLoading)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green m-auto"></div>
          <p className="mt-4 text-golf-green">Loading...</p>
        </div>
      </div>
    );
  }

  // For development: let the page load anyway after timeout, even without auth
  if (showingContent && !user && process.env.NODE_ENV === 'development') {
    console.warn('Development mode: Allowing access without authentication');
    return <>{children}</>;
  }

  // Regular auth check for production
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;
