
import React from 'react';
import Layout from '@/components/Layout';
import PhotoWall from '@/components/PhotoWall/PhotoWall';
import { useGolfState } from '@/hooks/useGolfState';
import { usePhotos } from '@/hooks/usePhotos';
import { Skeleton } from '@/components/ui/skeleton';

const Photos = () => {
  const { 
    games = [], 
    players = [], 
    photos = [], 
    isLoading = false
  } = useGolfState();
  
  const { addPhoto } = usePhotos();

  // Render content based on loading state
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Photo Wall</h1>
        <p className="text-gray-500">Share your golf moments with the swindle group!</p>
        
        <PhotoWall 
          photos={photos}
          games={games}
          players={players}
          isLoading={false}
          onUploadPhoto={addPhoto}
        />
      </div>
    );
  };

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default Photos;
