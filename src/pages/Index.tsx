import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import Dashboard from './Dashboard';

/**
 * Index page - Routes to auth or dashboard based on authentication state
 * 
 * This is the main entry point that handles:
 * - Loading state while checking authentication
 * - Showing auth form for unauthenticated users
 * - Showing dashboard for authenticated users
 */
const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center animate-pulse-soft shadow-glow">
            <svg 
              className="w-6 h-6 text-primary-foreground" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  // Show auth form or dashboard based on authentication state
  return isAuthenticated ? <Dashboard /> : <AuthForm />;
};

export default Index;
