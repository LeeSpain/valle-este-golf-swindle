
import React from 'react';
import Layout from '@/components/Layout';
import PhotoWall from '@/components/PhotoWall/PhotoWall';
import { useGolfState } from '@/hooks/useGolfState';
import { usePhotos } from '@/hooks/usePhotos';

const Photos = () => {
  const { 
    games, 
    players, 
    photos, 
    isLoading 
  } = useGolfState();
  const { addPhoto } = usePhotos();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Photo Wall</h1>
        <p className="text-gray-500">Share your golf moments with the swindle group!</p>
        
        <PhotoWall 
          photos={photos}
          games={games}
          players={players}
          isLoading={isLoading}
          onUploadPhoto={addPhoto}
        />
      </div>
    </Layout>
  );
};

export default Photos;
