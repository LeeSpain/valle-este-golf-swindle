
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhotoItem, Game } from '@/types';
import { Plus, Calendar, User } from 'lucide-react';

interface PhotoGridProps {
  photos: PhotoItem[];
  games: Game[];
  players: { id: string; name: string }[];
  isLoading: boolean;
  onAddPhoto: () => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ 
  photos, 
  games,
  players,
  isLoading, 
  onAddPhoto 
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">Loading photos...</p>
      </div>
    );
  }
  
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <p className="text-gray-500">No photos yet!</p>
        <Button 
          onClick={onAddPhoto}
          className="bg-golf-green hover:bg-golf-green-dark"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add the first photo
        </Button>
      </div>
    );
  }
  
  // Function to find game name by ID
  const findGameDate = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    return game ? new Date(game.date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) : 'Unknown Game';
  };
  
  // Function to find player name by ID
  const findPlayerName = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    return player ? player.name : 'Unknown Player';
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          onClick={onAddPhoto}
          className="bg-golf-green hover:bg-golf-green-dark"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Photo
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className="relative group overflow-hidden rounded-lg shadow-md transition-all hover:shadow-lg"
          >
            <img 
              src={photo.url} 
              alt={photo.caption || "Golf swindle photo"} 
              className="w-full h-64 object-cover transition-transform group-hover:scale-105" 
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
              {photo.caption && (
                <p className="font-medium text-sm mb-2">{photo.caption}</p>
              )}
              
              <div className="flex items-center text-xs mb-1">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{findGameDate(photo.gameId)}</span>
              </div>
              
              <div className="flex items-center text-xs">
                <User className="h-3 w-3 mr-1" />
                <span>Uploaded by {findPlayerName(photo.uploadedBy)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;
