
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGolfState } from '@/hooks/useGolfState';
import { Calendar, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import NextGame from '@/components/Dashboard/NextGame';
import PlayerStats from '@/components/Dashboard/PlayerStats';
import Weather from '@/components/Dashboard/Weather';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import StatsCards from '@/components/Dashboard/StatsCards';
import FeatureCards from '@/components/Dashboard/FeatureCards';
import DashboardError from '@/components/Dashboard/DashboardError';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  console.log("Index component starts rendering");
  const [renderError, setRenderError] = useState<string | null>(null);
  const { players, games, getNextGame, weather, scores, isLoading, error } = useGolfState();
  
  useEffect(() => {
    console.log("Index component mounted", { 
      playersCount: players?.length || 0, 
      gamesCount: games?.length || 0
    });
    
    toast({
      title: "Dashboard loaded",
      description: "Welcome to Karen's Bar Golf Swindle",
    });
    
    return () => {
      console.log("Index component unmounted");
    };
  }, [players, games]);
  
  // Add visible error fallback for debugging purposes
  if (error) {
    console.error("Dashboard error:", error);
    return (
      <Layout>
        <DashboardError error={error} />
      </Layout>
    );
  }
  
  // Add loading indicator
  if (isLoading) {
    console.log("Dashboard is loading...");
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green m-auto"></div>
            <p className="mt-4 text-golf-green">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  console.log("Dashboard preparing to render content");
  
  try {
    let nextGame = null;
    let currentPlayer = null;
    
    try {
      // Safely attempt to get the next game
      if (getNextGame && typeof getNextGame === 'function') {
        nextGame = getNextGame();
      }
      console.log("Next game retrieved:", nextGame ? nextGame.id : "none");
      
      // Safely get current player
      currentPlayer = players && players.length > 0 ? players[0] : null;
      console.log("Current player:", currentPlayer ? currentPlayer.name : "none");
    } catch (err) {
      console.error("Error preparing data:", err);
      // Continue rendering with null values rather than showing an error
    }
    
    return (
      <Layout>
        <div className="space-y-6">
          <DashboardHeader />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Next Game Card */}
            <Card className="md:col-span-2 shadow-md hover:shadow-lg transition-shadow border-gray-100">
              <CardHeader className="pb-2 bg-gradient-to-r from-golf-green-light/10 to-transparent rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-golf-green" />
                  <span>Next Game</span>
                </CardTitle>
                <CardDescription>
                  Upcoming game details and registration
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <NextGame 
                  game={nextGame} 
                  players={players || []} 
                  isLoading={isLoading} 
                />
              </CardContent>
              {nextGame && (
                <CardFooter>
                  <Button asChild variant="default" className="w-full sm:w-auto">
                    <Link to={`/games/${nextGame.id}`}>
                      View Game Details
                    </Link>
                  </Button>
                </CardFooter>
              )}
            </Card>

            {/* Weather Widget */}
            <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-100">
              <CardHeader className="pb-2 bg-gradient-to-r from-golf-green-light/10 to-transparent rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <span>Weather</span>
                </CardTitle>
                <CardDescription>
                  Current conditions at the course
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Weather 
                  weatherData={weather} 
                  isLoading={isLoading} 
                />
              </CardContent>
            </Card>
          </div>

          {/* Stats Row */}
          <StatsCards 
            players={players ? players.length : 0} 
            games={games ? games.length : 0} 
          />

          {/* Player Stats Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-100 mt-6">
            <CardHeader className="pb-2 bg-gradient-to-r from-golf-green-light/10 to-transparent rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-golf-green" />
                <span>Player Statistics</span>
              </CardTitle>
              <CardDescription>
                Top performers and recent achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <PlayerStats 
                player={currentPlayer} 
                scores={scores || []} 
                isLoading={isLoading} 
              />
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link to="/leaderboard">
                  View Full Leaderboard
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Feature Cards */}
          <FeatureCards />
        </div>
      </Layout>
    );
  } catch (err) {
    console.error("Error in Index component render:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error in Dashboard";
    // Update state to trigger a re-render with the error
    setRenderError(errorMessage);
    
    return (
      <Layout>
        <DashboardError error={errorMessage} />
      </Layout>
    );
  }
};

export default Index;
