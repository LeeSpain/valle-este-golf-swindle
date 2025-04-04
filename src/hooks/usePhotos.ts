
import { v4 as uuidv4 } from 'uuid';
import { PhotoItem } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useGolfStateContext } from '@/context/GolfStateContext';

export function usePhotos() {
  const { photos, setPhotos } = useGolfStateContext();
  
  const addPhoto = (photoData: Partial<PhotoItem>) => {
    const newPhoto: PhotoItem = {
      id: photoData.id || uuidv4(),
      gameId: photoData.gameId || '',
      url: photoData.url || '',
      caption: photoData.caption,
      uploadedBy: photoData.uploadedBy || '',
      createdAt: photoData.createdAt || new Date()
    };
    
    setPhotos(prev => [...prev, newPhoto]);
    
    toast({
      title: "Photo Uploaded",
      description: "Your photo has been added to the wall!"
    });
    
    return newPhoto;
  };
  
  const deletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    
    toast({
      title: "Photo Deleted",
      description: "The photo has been removed from the wall."
    });
    
    return true;
  };

  return {
    photos,
    addPhoto,
    deletePhoto
  };
}
