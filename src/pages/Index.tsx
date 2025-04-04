
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGolfState } from '@/hooks/useGolfState';
import { Calendar, Trophy, Users, Clock, Flag, SunIcon, CloudRain, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import NextGame from '@/components/Dashboard/NextGame';
import PlayerStats from '@/components/Dashboard/PlayerStats';
import Weather from '@/components/Dashboard/Weather';

// Custom GolfBall icon since it's not in lucide-react
const GolfBall = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
};

const Index = () => {
  const { players, games, getNextGame, weather, scores } = useGolfState();
  const nextGame = getNextGame();
  
  // Add current player (first player for demonstration)
  const currentPlayer = players.length > 0 ? players[0] : null;
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-golf-green to-golf-green-light">
              Welcome to Karen's Bar Golf Swindle
            </h1>
            <p className="text-muted-foreground mt-1">
              Track scores, view leaderboards, and stay connected with your golfing community
            </p>
          </div>
        </div>

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
                players={players} 
                isLoading={false} 
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
                {weather?.condition?.includes('rain') ? (
                  <CloudRain className="h-5 w-5 text-golf-green" />
                ) : (
                  <SunIcon className="h-5 w-5 text-golf-green" />
                )}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Users className="mr-2 h-4 w-4 text-golf-green" />
                Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{players.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active members in the group
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-golf-green" />
                Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{games.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total games scheduled
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <GolfBall className="mr-2 h-4 w-4 text-golf-green" />
                Course
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Valle del Este</div>
              <p className="text-xs text-muted-foreground mt-1">
                Home course for our events
              </p>
            </CardContent>
          </Card>
        </div>

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
              scores={scores} 
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-100">
            <CardHeader className="bg-gradient-to-r from-golf-green-light/10 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-golf-green" />
                <span>Manage Your Scores</span>
              </CardTitle>
              <CardDescription>
                Track your performance and see your progress over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <p className="text-sm">
                Enter your scores after each round and track your handicap changes
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-100">
            <CardHeader className="bg-gradient-to-r from-golf-green-light/10 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-golf-green" />
                <span>Photo Gallery</span>
              </CardTitle>
              <CardDescription>
                Share your best moments on the course
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <p className="text-sm">
                Upload photos from games and browse images shared by others
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline">
                <Link to="/photos">
                  View Gallery
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
