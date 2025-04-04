
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import Weather from '@/components/Dashboard/Weather';
import NextGame from '@/components/Dashboard/NextGame';
import PlayerStats from '@/components/Dashboard/PlayerStats';
import LeaderboardTable from '@/components/Leaderboard/LeaderboardTable';
import { useGolfState } from '@/hooks/useGolfState';
import { Button } from '@/components/ui/button';
import { User, Medal } from 'lucide-react';

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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Welcome to Karen's Bar Golf Swindle</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NextGame 
              game={nextGame}
              players={players}
              isLoading={isLoading}
            />
            {nextGame && (
              <div className="mt-2 flex justify-end">
                <Link to={`/games/${nextGame.id}`}>
                  <Button variant="outline" size="sm">
                    <Medal className="mr-2 h-4 w-4" />
                    View Game Details
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div>
            <Weather 
              weatherData={weather}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Latest Results</h2>
              {latestGame && (
                <Link to={`/games/${latestGame.id}`}>
                  <Button variant="outline" size="sm">
                    <Medal className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
              )}
            </div>
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
          </div>
          
          <div>
            <PlayerStats 
              player={currentPlayer}
              scores={scores}
              isLoading={isLoading}
            />
            {currentPlayer && (
              <div className="mt-2 flex justify-end">
                <Link to={`/players/${currentPlayer.id}`}>
                  <Button variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
