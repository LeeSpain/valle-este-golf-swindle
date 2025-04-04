
import React, { useEffect, useState, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GolfStateProvider } from "./context/GolfStateContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import AuthRoute from "./components/AuthRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Leaderboard from "./pages/Leaderboard";
import Photos from "./pages/Photos";
import PlayerProfile from "./pages/PlayerProfile";
import GameDetails from "./pages/GameDetails";
import Help from "./pages/Help";
import AdminDashboard from "./pages/admin/Dashboard";
import Players from "./pages/admin/Players";
import Games from "./pages/admin/Games";
import Scores from "./pages/admin/Scores";
import AdminSettings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";
import './App.css';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      meta: {
        // Add error handling through meta for the latest version of react-query
        onError: (error: any) => {
          console.error("Query error:", error);
        }
      }
    },
  },
});

// Simple loading component
const LoadingFallback = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green m-auto"></div>
      <p className="mt-4 text-golf-green">Loading application...</p>
    </div>
  </div>
);

// Application error fallback
const AppErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 border border-red-200">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Application Error</h2>
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          {error.message || "An unknown error occurred"}
        </AlertDescription>
      </Alert>
      <p className="text-gray-600 mb-6">
        Try refreshing the page. If the problem persists, please contact support.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="py-2 px-4 bg-golf-green hover:bg-golf-green-dark text-white rounded-md shadow-sm transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

const App = () => {
  const [appReady, setAppReady] = useState(false);
  const [appError, setAppError] = useState<Error | null>(null);
  const [renderCount, setRenderCount] = useState(0);
  
  // Log each render of the App component
  useEffect(() => {
    console.log(`App render #${renderCount + 1}`, { appReady, hasError: !!appError });
    setRenderCount(prev => prev + 1);
  });
  
  useEffect(() => {
    console.log('App component mounted');
    
    // Log environment info
    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      isDevelopment: process.env.NODE_ENV === 'development'
    });
    
    try {
      // Mark app as ready after a small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        setAppReady(true);
        console.log('App marked as ready');
      }, 100);
      
      // Force app to show after a longer timeout even if there are issues
      const emergencyTimer = setTimeout(() => {
        if (!appReady) {
          console.log('Emergency timeout: forcing app to render');
          setAppReady(true);
        }
      }, 2000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(emergencyTimer);
        console.log('App component unmounted');
      };
    } catch (error) {
      console.error("Error in App useEffect:", error);
      setAppError(error instanceof Error ? error : new Error('Unknown error in App initialization'));
      setAppReady(true); // Ensure we still render something
      return () => {};
    }
  }, []);

  // Handle any errors in the app
  if (appError) {
    return <AppErrorFallback error={appError} />;
  }

  // Simple emergency rendering if something fails
  if (!appReady) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <GolfStateProvider>
                <NotificationsProvider>
                  <Toaster />
                  <Sonner />
                  <ErrorBoundary>
                    <BrowserRouter>
                      <Routes>
                        <Route path="/login" element={<Login />} />
                        
                        {/* Protected Routes with simplified auth for development */}
                        <Route 
                          path="/" 
                          element={
                            <AuthRoute>
                              <Index />
                            </AuthRoute>
                          } 
                        />
                        <Route 
                          path="/leaderboard" 
                          element={
                            <AuthRoute>
                              <Leaderboard />
                            </AuthRoute>
                          } 
                        />
                        <Route 
                          path="/photos" 
                          element={
                            <AuthRoute>
                              <Photos />
                            </AuthRoute>
                          } 
                        />
                        <Route 
                          path="/help" 
                          element={
                            <AuthRoute>
                              <Help />
                            </AuthRoute>
                          } 
                        />
                        <Route 
                          path="/players/:playerId" 
                          element={
                            <AuthRoute>
                              <PlayerProfile />
                            </AuthRoute>
                          } 
                        />
                        <Route 
                          path="/games/:gameId" 
                          element={
                            <AuthRoute>
                              <GameDetails />
                            </AuthRoute>
                          } 
                        />
                        
                        {/* Admin Routes */}
                        <Route 
                          path="/admin" 
                          element={
                            <AuthRoute requireAdmin>
                              <AdminDashboard />
                            </AuthRoute>
                          } 
                        />
                        <Route 
                          path="/admin/players" 
                          element={
                            <AuthRoute requireAdmin>
                              <Players />
                            </AuthRoute>
                          } 
                        />
                        <Route 
                          path="/admin/games" 
                          element={
                            <AuthRoute requireAdmin>
                              <Games />
                            </AuthRoute>
                          } 
                        />
                        <Route 
                          path="/admin/scores" 
                          element={
                            <AuthRoute requireAdmin>
                              <Scores />
                            </AuthRoute>
                          } 
                        />
                        <Route 
                          path="/admin/settings" 
                          element={
                            <AuthRoute requireAdmin>
                              <AdminSettings />
                            </AuthRoute>
                          } 
                        />
                        
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </BrowserRouter>
                  </ErrorBoundary>
                </NotificationsProvider>
              </GolfStateProvider>
            </Suspense>
          </ErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
