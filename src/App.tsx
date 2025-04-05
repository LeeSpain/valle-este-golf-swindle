import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GolfStateProvider } from "./context/GolfStateContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import AuthRoute from "./components/AuthRoute";

// Create a more stable loading component
const LoadingFallback = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green m-auto"></div>
      <p className="mt-4 text-golf-green">Loading application...</p>
    </div>
  </div>
);

// Import pages with lazy loading but preload main routes
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Photos = lazy(() => import("./pages/Photos"));
const PlayerProfile = lazy(() => import("./pages/PlayerProfile"));
const GameDetails = lazy(() => import("./pages/GameDetails"));
const Help = lazy(() => import("./pages/Help"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const Players = lazy(() => import("./pages/admin/Players"));
const Games = lazy(() => import("./pages/admin/Games"));
const Scores = lazy(() => import("./pages/admin/Scores"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
import './App.css';

// Preload main routes in background
const preloadRoutes = () => {
  const routesToPreload = [
    import("./pages/Index"),
    import("./pages/Login")
  ];
  return Promise.all(routesToPreload);
};

// Create QueryClient with better error handling and longer staleTime
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes (renamed from cacheTime)
    },
  },
});

const App = () => {
  console.log('App component rendering');
  const [appReady, setAppReady] = useState(false);
  
  // Preload routes and set app as ready
  useEffect(() => {
    preloadRoutes().then(() => {
      console.log("Routes preloaded");
      setAppReady(true);
    });
  }, []);
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <GolfStateProvider>
              <NotificationsProvider>
                {/* Global UI components */}
                <Toaster />
                <Sonner />
                
                {/* Application routes - only render when ready */}
                {appReady ? (
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      {/* Public route */}
                      <Route path="/login" element={<Login />} />
                      
                      {/* Protected Routes - Each wrapped in its own ErrorBoundary */}
                      <Route 
                        path="/" 
                        element={
                          <AuthRoute>
                            <ErrorBoundary>
                              <Index />
                            </ErrorBoundary>
                          </AuthRoute>
                        } 
                      />
                      
                      <Route 
                        path="/leaderboard" 
                        element={
                          <AuthRoute>
                            <ErrorBoundary>
                              <Leaderboard />
                            </ErrorBoundary>
                          </AuthRoute>
                        } 
                      />
                      
                      <Route 
                        path="/photos" 
                        element={
                          <AuthRoute>
                            <ErrorBoundary>
                              <Photos />
                            </ErrorBoundary>
                          </AuthRoute>
                        } 
                      />
                      
                      <Route 
                        path="/help" 
                        element={
                          <AuthRoute>
                            <ErrorBoundary>
                              <Help />
                            </ErrorBoundary>
                          </AuthRoute>
                        } 
                      />
                      
                      <Route 
                        path="/players/:playerId" 
                        element={
                          <AuthRoute>
                            <ErrorBoundary>
                              <PlayerProfile />
                            </ErrorBoundary>
                          </AuthRoute>
                        } 
                      />
                      
                      <Route 
                        path="/games/:gameId" 
                        element={
                          <AuthRoute>
                            <ErrorBoundary>
                              <GameDetails />
                            </ErrorBoundary>
                          </AuthRoute>
                        } 
                      />
                      
                      {/* Admin Routes - Each wrapped in its own ErrorBoundary */}
                      <Route 
                        path="/admin" 
                        element={
                          <AuthRoute requireAdmin>
                            <ErrorBoundary>
                              <AdminDashboard />
                            </ErrorBoundary>
                          </AuthRoute>
                        } 
                      />
                      
                      <Route 
                        path="/admin/players" 
                        element={
                          <AuthRoute requireAdmin>
                            <ErrorBoundary>
                              <Players />
                            </ErrorBoundary>
                          </AuthRoute>
                        } 
                      />
                      
                      <Route 
                        path="/admin/games" 
                        element={
                          <AuthRoute requireAdmin>
                            <ErrorBoundary>
                              <Games />
                            </ErrorBoundary>
                          </AuthRoute>
                        } 
                      />
                      
                      <Route 
                        path="/admin/scores" 
                        element={
                          <AuthRoute requireAdmin>
                            <ErrorBoundary>
                              <Scores />
                            </ErrorBoundary>
                          </AuthRoute>
                        } 
                      />
                      
                      <Route 
                        path="/admin/settings" 
                        element={
                          <AuthRoute requireAdmin>
                            <ErrorBoundary>
                              <AdminSettings />
                            </ErrorBoundary>
                          </AuthRoute>
                        } 
                      />
                      
                      {/* Fallback route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                ) : (
                  <LoadingFallback />
                )}
              </NotificationsProvider>
            </GolfStateProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
