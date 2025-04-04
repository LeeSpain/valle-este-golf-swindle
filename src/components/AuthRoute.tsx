
import React, { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [showingContent, setShowingContent] = useState(false);

  useEffect(() => {
    console.log("AuthRoute mounted", { user, isLoading });
    
    // Set a timeout to show content even if auth is taking too long
    // This prevents the app from being stuck in a loading state
    const timer = setTimeout(() => {
      setShowingContent(true);
      console.log("AuthRoute timeout triggered, showing content anyway");
    }, 500); // Reduced timeout for faster development
    
    return () => clearTimeout(timer);
  }, []);

  // Always allow access in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log("Development mode: bypassing authentication");
    return <>{children}</>;
  }

  // Show loading state briefly
  if (isLoading && !showingContent) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green m-auto"></div>
          <p className="mt-4 text-golf-green">Loading...</p>
        </div>
      </div>
    );
  }

  // For production: proper auth checks
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthRoute;
