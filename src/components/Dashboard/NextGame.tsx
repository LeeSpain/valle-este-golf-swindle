
import React from 'react';
import { Game, Player } from '@/types';
import { Calendar, Clock, Flag, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface NextGameProps {
  game: Game | null;
  players: Player[];
  isLoading: boolean;
}

const NextGame: React.FC<NextGameProps> = ({ game, players, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Skeleton className="h-5 w-5 mr-2" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-5 w-5 mr-2" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-5 w-5 mr-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="flex items-start">
          <Skeleton className="h-5 w-5 mr-2 mt-1" />
          <div className="w-full">
            <Skeleton className="h-5 w-20 mb-1" />
            <Skeleton className="h-4 w-full max-w-[200px]" />
            <Skeleton className="h-4 w-full max-w-[180px] mt-1" />
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="py-8 text-center">
        <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">No upcoming games scheduled</h3>
        <p className="text-gray-400 mb-4">Check back soon for new game announcements</p>
        <Button asChild variant="default">
          <Link to="/admin/games">Schedule a Game</Link>
        </Button>
      </div>
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Next Game</h3>
        {diffDays <= 7 && (
          <span className="bg-golf-green text-white text-sm px-3 py-1 rounded-full">
            {diffDays === 0 ? 'Today' : `${diffDays} day${diffDays !== 1 ? 's' : ''} away`}
          </span>
        )}
      </div>
      
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
    </div>
  );
};

export default NextGame;
