import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth: boolean;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, requireAuth }) => {
  const { token } = useAuth();
  const location = useLocation();

  if (requireAuth && !token) {
    // Redirect to login if auth is required but user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && token) {
    // Redirect to dashboard if user is authenticated but tries to access public routes
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};