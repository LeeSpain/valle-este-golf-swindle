
import React from 'react';
import { Game, Player } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Flag, Users } from 'lucide-react';

interface NextGameProps {
  game: Game | null;
  players: Player[];
  isLoading: boolean;
}

const NextGame: React.FC<NextGameProps> = ({ game, players, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Next Game</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <p>Loading next game...</p>
        </CardContent>
      </Card>
    );
  }

  if (!game) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Next Game</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No upcoming games scheduled</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate days remaining until the game
  const today = new Date();
  const gameDate = new Date(game.date);
  const diffTime = Math.abs(gameDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Format the date
  const formattedDate = gameDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Get player names for this game
  const gamePlayerNames = players
    .filter(player => game.players.includes(player.id))
    .map(player => player.name);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>Next Game</span>
          {diffDays <= 7 && (
            <span className="bg-golf-green text-white text-sm px-3 py-1 rounded-full">
              {diffDays === 0 ? 'Today' : `${diffDays} day${diffDays !== 1 ? 's' : ''} away`}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-golf-green" />
          <span>{formattedDate}</span>
        </div>
        
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-golf-green" />
          <span>Tee Time: {game.teeTime}</span>
        </div>
        
        <div className="flex items-center">
          <Flag className="w-5 h-5 mr-2 text-golf-green" />
          <span>
            {game.courseSide === 'front9' ? 'Front 9 (Holes 1-9)' : 'Back 9 (Holes 10-18)'}
          </span>
        </div>
        
        <div className="flex items-start">
          <Users className="w-5 h-5 mr-2 text-golf-green mt-1" />
          <div>
            <p className="font-semibold mb-1">Players:</p>
            {gamePlayerNames.length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {gamePlayerNames.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No players confirmed yet</p>
            )}
          </div>
        </div>
        
        {game.notes && (
          <div className="mt-4 p-3 bg-sand-beige-light rounded-md">
            <p className="text-sm font-semibold">Notes:</p>
            <p className="text-sm">{game.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NextGame;
