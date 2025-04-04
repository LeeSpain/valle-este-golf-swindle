
import React from 'react';
import Layout from '@/components/Layout';
import Weather from '@/components/Dashboard/Weather';
import NextGame from '@/components/Dashboard/NextGame';
import PlayerStats from '@/components/Dashboard/PlayerStats';
import LeaderboardTable from '@/components/Leaderboard/LeaderboardTable';
import { useGolfState } from '@/hooks/useGolfState';

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
            <LeaderboardTable 
              scores={scores}
              players={players}
              game={latestGame}
              isLoading={isLoading}
            />
          </div>
          
          <div>
            <PlayerStats 
              player={currentPlayer}
              scores={scores}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
