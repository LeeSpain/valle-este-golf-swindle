
import React, { useEffect, useMemo } from 'react';
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
  // Add more logging to identify rendering issues
  console.log("Index component starts rendering");
  const { players, games, getNextGame, weather, scores, isLoading, error } = useGolfState();
  
  // Initialize all data once - this prevents conditional hooks
  const nextGame = useMemo(() => getNextGame ? getNextGame() : null, [getNextGame]);
  const currentPlayer = useMemo(() => 
    players && players.length > 0 ? players[0] : null, 
  [players]);
  
  console.log("Index component data:", { 
    playersCount: players?.length || 0,
    gamesCount: games?.length || 0,
    nextGameId: nextGame?.id || "none",
    currentPlayerName: currentPlayer?.name || "none",
    isLoading
  });
  
  // Welcome toast is shown only once when the component mounts
  useEffect(() => {
    // Small delay to prevent toast from showing during navigation
    const timer = setTimeout(() => {
      toast({
        title: "Dashboard loaded",
        description: "Welcome to Karen's Bar Golf Swindle",
      });
    }, 500);
    
    return () => {
      clearTimeout(timer);
      console.log("Index component unmounted");
    };
  }, []);
  
  // Handle loading state with a dedicated component
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
  
  // Handle error state
  if (error) {
    console.error("Dashboard error:", error);
    return (
      <Layout>
        <DashboardError error={error} />
      </Layout>
    );
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
                isLoading={false} 
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
                isLoading={false} 
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
              isLoading={false} 
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
};

export default React.memo(Index);
