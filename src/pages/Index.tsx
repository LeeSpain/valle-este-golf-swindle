
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Weather from '@/components/Dashboard/Weather';
import NextGame from '@/components/Dashboard/NextGame';
import PlayerStats from '@/components/Dashboard/PlayerStats';
import LeaderboardTable from '@/components/Leaderboard/LeaderboardTable';
import { useGolfState } from '@/hooks/useGolfState';
import { Button } from '@/components/ui/button';
import { User, Medal, ArrowRight, Calendar, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const { 
    players, 
    scores, 
    weather, 
    isLoading,
    getNextGame,
    getLatestCompletedGame
  } = useGolfState();
  
  // For demo purposes, let's use a pre-selected player
  // In a real app, this would come from authentication
  const currentPlayer = players.length > 0 ? players[0] : null;
  
  // Get the next game and latest completed game
  const nextGame = getNextGame();
  const latestGame = getLatestCompletedGame();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-golf-green to-golf-green-light">
            Welcome to Karen's Bar Golf Swindle
          </h1>
          <div className="hidden md:block">
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-none shadow-lg bg-white">
              <CardHeader className="bg-golf-green text-white">
                <CardTitle className="flex items-center text-xl">
                  <Calendar className="mr-2 h-5 w-5" />
                  Next Game
                </CardTitle>
                <CardDescription className="text-white/80">
                  {nextGame ? `${new Date(nextGame.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}` : 'No upcoming games'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <NextGame 
                  game={nextGame}
                  players={players}
                  isLoading={isLoading}
                />
              </CardContent>
              {nextGame && (
                <CardFooter className="flex justify-end p-4 pt-0">
                  <Link to={`/games/${nextGame.id}`}>
                    <Button variant="outline" size="sm" className="gap-1 hover:gap-2 transition-all group">
                      <span>Game Details</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          </div>
          
          <div>
            <Card className="overflow-hidden border-none shadow-lg bg-white h-full">
              <CardHeader className="bg-golf-green text-white">
                <CardTitle className="flex items-center text-xl">
                  <Clock className="mr-2 h-5 w-5" />
                  Weather
                </CardTitle>
                <CardDescription className="text-white/80">
                  Course conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Weather 
                  weatherData={weather}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-none shadow-lg bg-white">
              <CardHeader className="bg-golf-green text-white">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center text-xl">
                    <Medal className="mr-2 h-5 w-5" />
                    Latest Results
                  </CardTitle>
                  {latestGame && (
                    <Link to={`/games/${latestGame.id}`}>
                      <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-golf-green">
                        View Details
                      </Button>
                    </Link>
                  )}
                </div>
                <CardDescription className="text-white/80">
                  {latestGame ? `${new Date(latestGame.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}` : 'No completed games'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <LeaderboardTable 
                  scores={scores}
                  players={players}
                  game={latestGame}
                  isLoading={isLoading}
                  renderPlayerCell={(player) => (
                    <Link to={`/players/${player.id}`} className="font-medium hover:underline flex items-center">
                      {player.name}
                      <User className="h-3.5 w-3.5 ml-2 text-gray-400" />
                    </Link>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="overflow-hidden border-none shadow-lg bg-white h-full">
              <CardHeader className="bg-golf-green text-white">
                <CardTitle className="flex items-center text-xl">
                  <Users className="mr-2 h-5 w-5" />
                  Player Stats
                </CardTitle>
                <CardDescription className="text-white/80">
                  {currentPlayer ? currentPlayer.name : 'No player selected'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <PlayerStats 
                  player={currentPlayer}
                  scores={scores}
                  isLoading={isLoading}
                />
              </CardContent>
              {currentPlayer && (
                <CardFooter className="flex justify-end p-4">
                  <Link to={`/players/${currentPlayer.id}`}>
                    <Button variant="outline" size="sm" className="gap-1 hover:gap-2 transition-all group">
                      <span>View Profile</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
