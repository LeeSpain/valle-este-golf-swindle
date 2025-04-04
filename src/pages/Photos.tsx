
import React from 'react';
import Layout from '@/components/Layout';
import PhotoWall from '@/components/PhotoWall/PhotoWall';
import { useGolfState } from '@/hooks/useGolfState';

const Photos = () => {
  const { 
    games, 
    players, 
    photos, 
    isLoading,
    addPhoto
  } = useGolfState();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Photo Wall</h1>
        <p className="text-gray-500">Share your golf moments with the swindle group!</p>
        
        <PhotoWall 
          photos={photos}
          games={games}
          players={players}
          onUploadPhoto={addPhoto}
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
};

export default Photos;
