
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GolfStateProvider } from "./context/GolfStateContext";
import Index from "./pages/Index";
import Leaderboard from "./pages/Leaderboard";
import Photos from "./pages/Photos";
import AdminDashboard from "./pages/admin/Dashboard";
import Players from "./pages/admin/Players";
import Games from "./pages/admin/Games";
import Scores from "./pages/admin/Scores";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GolfStateProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/photos" element={<Photos />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/players" element={<Players />} />
            <Route path="/admin/games" element={<Games />} />
            <Route path="/admin/scores" element={<Scores />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GolfStateProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
