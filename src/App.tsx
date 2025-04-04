
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  useEffect(() => {
    console.log('App component mounted');
    
    // Log environment info
    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      isDevelopment: process.env.NODE_ENV === 'development'
    });
    
    return () => {
      console.log('App component unmounted');
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GolfStateProvider>
          <NotificationsProvider>
            {/* Replace console.log with null to resolve ReactNode type issue */}
            <Toaster />
            <Sonner />
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
          </NotificationsProvider>
        </GolfStateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
