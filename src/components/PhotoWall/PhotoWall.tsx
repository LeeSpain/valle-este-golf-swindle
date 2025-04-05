
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PhotoGrid from './PhotoGrid';
import PhotoUpload from './PhotoUpload';
import { PhotoItem, Game } from '@/types';
import { Camera, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PhotoWallProps {
  photos: PhotoItem[];
  games: Game[];
  players: { id: string; name: string }[];
  onUploadPhoto: (photo: Partial<PhotoItem>, file?: File) => void;
  isLoading: boolean;
}

const PhotoWall: React.FC<PhotoWallProps> = ({ 
  photos, 
  games, 
  players,
  onUploadPhoto,
  isLoading 
}) => {
  const [selectedGameId, setSelectedGameId] = useState<string>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [processedPhotos, setProcessedPhotos] = useState<PhotoItem[]>([]);
  
  // Process photos only once when photos prop changes
  useEffect(() => {
    if (photos && photos.length > 0) {
      console.log(`Processing ${photos.length} photos`);
      setProcessedPhotos(photos);
    } else {
      setProcessedPhotos([]);
    }
  }, [photos]);
  
  // Sort games by date (newest first)
  const sortedGames = games && games.length > 0 
    ? [...games].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];
  
  // Filter photos by selected game
  const filteredPhotos = selectedGameId === 'all'
    ? processedPhotos
    : processedPhotos.filter(photo => photo.gameId === selectedGameId);
  
  useEffect(() => {
    console.log("PhotoWall component state:", {
      photoCount: photos?.length,
      processedPhotoCount: processedPhotos?.length,
      gameCount: games?.length, 
      isLoading
    });
  }, [photos, processedPhotos, games, isLoading]);
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Camera className="mr-2 h-6 w-6 text-golf-green" />
          <CardTitle>Photo Wall</CardTitle>
        </div>
        
        <div className="flex space-x-2">
          <Select 
            value={selectedGameId} 
            onValueChange={setSelectedGameId}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All games" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All games</SelectItem>
              {sortedGames.map(game => (
                <SelectItem key={game.id} value={game.id}>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(game.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {isUploadOpen ? (
          <PhotoUpload 
            games={sortedGames} 
            players={players}
            onUpload={onUploadPhoto}
            onCancel={() => setIsUploadOpen(false)}
          />
        ) : (
          <PhotoGrid 
            photos={filteredPhotos} 
            games={games}
            players={players}
            isLoading={isLoading}
            onAddPhoto={() => setIsUploadOpen(true)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoWall;
