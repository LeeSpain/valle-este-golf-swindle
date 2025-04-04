
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '@/api/authService';

interface AuthRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children, requireAdmin = false }) => {
  const authenticated = isAuthenticated();
  const admin = isAdmin();
  
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !admin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default AuthRoute;
