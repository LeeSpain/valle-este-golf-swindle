
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import PhotoWall from '@/components/PhotoWall/PhotoWall';
import { useGolfState } from '@/hooks/useGolfState';
import { usePhotos } from '@/hooks/usePhotos';
import { Loader } from 'lucide-react';

const Photos = () => {
  const { 
    games = [], 
    players = [], 
    photos = [], 
    isLoading = true
  } = useGolfState();
  
  const { addPhoto } = usePhotos();
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    console.log("Photos page mounted with state:", { 
      gamesCount: games.length, 
      playersCount: players.length,
      photosCount: photos.length,
      isLoading
    });
    
    // Set page as ready after data is loaded or after 2 seconds (whichever comes first)
    const timeout = setTimeout(() => {
      setIsPageReady(true);
    }, 2000);
    
    if (!isLoading && games.length > 0 && players.length > 0) {
      clearTimeout(timeout);
      setIsPageReady(true);
    }
    
    return () => clearTimeout(timeout);
  }, [games, players, photos, isLoading]);

  if (!isPageReady) {
    return (
      <Layout>
        <div className="h-[70vh] flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green"></div>
          <p className="mt-4 text-golf-green">Loading photo gallery...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Photo Wall</h1>
        <p className="text-gray-500">Share your golf moments with the swindle group!</p>
        
        <PhotoWall 
          photos={photos}
          games={games}
          players={players}
          isLoading={false} // Force isLoading to false since we've already checked
          onUploadPhoto={addPhoto}
        />
      </div>
    </Layout>
  );
};

export default Photos;
