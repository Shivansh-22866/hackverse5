import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RouteGuard } from './components/ui/RouteGuard';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { Toaster } from '@/components/ui/toaster';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes - only accessible when not logged in */}
          <Route 
            path="/" 
            element={
              <RouteGuard requireAuth={false}>
                <HomePage />
              </RouteGuard>
            } 
          />
          <Route 
            path="/login" 
            element={
              <RouteGuard requireAuth={false}>
                <LoginPage />
              </RouteGuard>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <RouteGuard requireAuth={false}>
                <SignupPage />
              </RouteGuard>
            } 
          />

          {/* Protected routes - only accessible when logged in */}
          <Route 
            path="/dashboard/*" 
            element={
              <RouteGuard requireAuth={true}>
                <DashboardPage />
              </RouteGuard>
            } 
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
};

export default App;