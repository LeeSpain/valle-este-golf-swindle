
import React, { useEffect } from 'react';
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

const Index = () => {
  const { players, games, getNextGame, weather, scores, isLoading, error } = useGolfState();
  
  useEffect(() => {
    console.log("Index component mounted", { players, games, weather, scores, isLoading, error });
    return () => {
      console.log("Index component unmounted");
    };
  }, []);
  
  // Add more logging to track rendering
  console.log("Dashboard rendering with data:", { 
    playersLength: players?.length || 0, 
    gamesLength: games?.length || 0, 
    weatherAvailable: !!weather, 
    scoresLength: scores?.length || 0, 
    isLoading, 
    hasError: !!error 
  });
  
  // Handle loading state or errors
  if (error && !isLoading) {
    return (
      <Layout>
        <DashboardError error={error} />
      </Layout>
    );
  }
  
  // Try-catch to prevent blank screens from errors
  try {
    const nextGame = getNextGame ? getNextGame() : null;
    
    // Add current player (first player for demonstration)
    const currentPlayer = players && players.length > 0 ? players[0] : null;
    
    return (
      <Layout>
        <div className="space-y-6 animate-fade-in">
          <DashboardHeader />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Next Game Card */}
            <Card className="md:col-span-2 shadow-md hover:shadow-lg transition-shadow border-none glass-card">
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
              <CardFooter>
                {nextGame && (
                  <Button asChild variant="default" className="w-full sm:w-auto">
                    <Link to={`/games/${nextGame.id}`}>
                      View Game Details
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Weather Widget */}
            <Card className="shadow-md hover:shadow-lg transition-shadow border-none glass-card">
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
          <Card className="shadow-md hover:shadow-lg transition-shadow border-none glass-card mt-6">
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
    console.error("Error rendering Index component:", err);
    return (
      <Layout>
        <DashboardError error={err instanceof Error ? err.message : "Unknown error"} />
      </Layout>
    );
  }
};

export default Index;
