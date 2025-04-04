
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import LeaderboardTable from '@/components/Leaderboard/LeaderboardTable';
import { useGolfState } from '@/hooks/useGolfState';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Leaderboard = () => {
  const { games, players, scores, isLoading } = useGolfState();
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  
  // Sort games by date (newest first)
  const sortedGames = [...games]
    .filter(game => game.isComplete)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // If no game is selected, use the latest one
  const selectedGame = selectedGameId 
    ? games.find(g => g.id === selectedGameId)
    : sortedGames.length > 0 ? sortedGames[0] : null;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          
          <div className="w-64">
            <Select 
              value={selectedGameId || (selectedGame?.id || '')} 
              onValueChange={setSelectedGameId}
              disabled={isLoading || sortedGames.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                {sortedGames.map(game => (
                  <SelectItem key={game.id} value={game.id}>
                    {new Date(game.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                    {' - '}
                    {game.courseSide === 'front9' ? 'Front 9' : 'Back 9'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <LeaderboardTable 
          scores={scores}
          players={players}
          game={selectedGame}
          isLoading={isLoading}
        />
        
        {!isLoading && (!selectedGame || sortedGames.length === 0) && (
          <div className="text-center py-8">
            <p className="text-gray-500">No completed games available</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Leaderboard;
