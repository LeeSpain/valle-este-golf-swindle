
import React, { useMemo } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  // Add more logging to identify rendering issues
  console.log("Index component starts rendering");
  
  // Get data from GolfState
  const { players, games, getNextGame, weather, scores, isLoading, error } = useGolfState();
  
  // Initialize all data once - this prevents conditional hooks
  const nextGame = useMemo(() => {
    console.log("Index calculating nextGame, getNextGame exists:", !!getNextGame);
    return getNextGame ? getNextGame() : null;
  }, [getNextGame]);
  
  const currentPlayer = useMemo(() => {
    console.log("Index calculating currentPlayer, players:", players?.length || 0);
    return players && players.length > 0 ? players[0] : null;
  }, [players]);
  
  console.log("Index component data:", { 
    playersCount: players?.length || 0,
    gamesCount: games?.length || 0,
    nextGameId: nextGame?.id || "none",
    currentPlayerName: currentPlayer?.name || "none",
    isLoading
  });
  
  // Create render content separate from component return to ensure stable rendering
  const renderContent = () => {
    // Handle loading state with a dedicated component
    if (isLoading) {
      console.log("Dashboard is loading...");
      return (
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="md:col-span-2 h-[300px] rounded-lg" />
            <Skeleton className="h-[300px] rounded-lg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-[100px] rounded-lg" />
            <Skeleton className="h-[100px] rounded-lg" />
            <Skeleton className="h-[100px] rounded-lg" />
          </div>
          <Skeleton className="h-[250px] rounded-lg" />
        </div>
      );
    }
    
    // Handle error state
    if (error) {
      console.error("Dashboard error:", error);
      return <DashboardError error={error} />;
    }
    
    return (
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
    );
  };
  
  console.log("Index component about to return Layout");
  
  // Always render inside Layout so navigation remains visible
  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default Index;
