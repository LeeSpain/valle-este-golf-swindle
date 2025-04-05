
import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GolfStateProvider } from "./context/GolfStateContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import AuthRoute from "./components/AuthRoute";

// Import pages
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

// Create QueryClient with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
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

const App = () => {
  console.log('App component rendering');
  
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
                
                {/* Application routes */}
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Public route */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* Protected Routes */}
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
                    
                    <Route path="/leaderboard" element={<AuthRoute><Leaderboard /></AuthRoute>} />
                    <Route path="/photos" element={<AuthRoute><Photos /></AuthRoute>} />
                    <Route path="/help" element={<AuthRoute><Help /></AuthRoute>} />
                    <Route path="/players/:playerId" element={<AuthRoute><PlayerProfile /></AuthRoute>} />
                    <Route path="/games/:gameId" element={<AuthRoute><GameDetails /></AuthRoute>} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AuthRoute requireAdmin><AdminDashboard /></AuthRoute>} />
                    <Route path="/admin/players" element={<AuthRoute requireAdmin><Players /></AuthRoute>} />
                    <Route path="/admin/games" element={<AuthRoute requireAdmin><Games /></AuthRoute>} />
                    <Route path="/admin/scores" element={<AuthRoute requireAdmin><Scores /></AuthRoute>} />
                    <Route path="/admin/settings" element={<AuthRoute requireAdmin><AdminSettings /></AuthRoute>} />
                    
                    {/* Fallback route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </NotificationsProvider>
            </GolfStateProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
