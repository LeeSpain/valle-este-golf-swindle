
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import LeaderboardTable from '@/components/Leaderboard/LeaderboardTable';
import { useGolfState } from '@/hooks/useGolfState';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { User, Medal } from 'lucide-react';

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
        
        {selectedGame && (
          <div className="flex justify-between items-center">
            <p className="text-gray-500">
              Game from {new Date(selectedGame.date).toLocaleDateString()} - {selectedGame.courseSide === 'front9' ? 'Front 9' : 'Back 9'}
            </p>
            <Link to={`/games/${selectedGame.id}`}>
              <Button variant="outline" size="sm">
                <Medal className="mr-2 h-4 w-4" />
                View Game Details
              </Button>
            </Link>
          </div>
        )}
        
        <LeaderboardTable 
          scores={scores}
          players={players}
          game={selectedGame}
          isLoading={isLoading}
          renderPlayerCell={(player) => (
            <Link to={`/players/${player.id}`} className="font-medium hover:underline flex items-center">
              {player.name}
              <User className="h-3.5 w-3.5 ml-2 text-gray-400" />
            </Link>
          )}
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
