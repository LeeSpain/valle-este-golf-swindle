
import { v4 as uuidv4 } from 'uuid';
import { PhotoItem } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useGolfStateContext } from '@/context/GolfStateContext';
import { uploadPhoto, deletePhoto as apiDeletePhoto } from '@/api/photoService';
import { useRef, useEffect } from 'react';

export function usePhotos() {
  const { photos, setPhotos } = useGolfStateContext();
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  const addPhoto = async (photoData: Partial<PhotoItem>, file?: File) => {
    try {
      if (!file && !photoData.url) {
        throw new Error('Either file or URL must be provided');
      }
      
      let newPhoto: PhotoItem | null = null;
      
      if (file) {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        
        if (photoData.gameId) formData.append('gameId', photoData.gameId);
        if (photoData.caption) formData.append('caption', photoData.caption);
        if (photoData.uploadedBy) formData.append('uploadedBy', photoData.uploadedBy);
        
        // Upload the file
        try {
          newPhoto = await uploadPhoto(formData);
        } catch (error) {
          console.error("Error uploading photo:", error);
          throw error;
        }
      } else {
        // Use provided URL (for testing purposes)
        newPhoto = {
          id: photoData.id || uuidv4(),
          gameId: photoData.gameId || '',
          url: photoData.url || '',
          caption: photoData.caption,
          uploadedBy: photoData.uploadedBy || '',
          createdAt: photoData.createdAt || new Date()
        };
      }
      
      if (newPhoto && isMountedRef.current) {
        setPhotos(prev => {
          // Make sure we don't add duplicates
          const exists = prev.some(p => p.id === newPhoto!.id);
          return exists ? prev : [...prev, newPhoto!];
        });
        
        toast({
          title: "Photo Uploaded",
          description: "Your photo has been added to the wall!"
        });
      }
      
      return newPhoto;
    } catch (error) {
      console.error('Error uploading photo:', error);
      
      if (isMountedRef.current) {
        toast({
          title: "Upload Failed",
          description: "There was a problem uploading your photo. Please try again.",
          variant: "destructive"
        });
      }
      
      return null;
    }
  };
  
  const deletePhoto = async (photoId: string) => {
    try {
      await apiDeletePhoto(photoId);
      
      if (isMountedRef.current) {
        setPhotos(prev => prev.filter(photo => photo.id !== photoId));
        
        toast({
          title: "Photo Deleted",
          description: "The photo has been removed from the wall."
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      return false;
    }
  };

  return {
    photos,
    addPhoto,
    deletePhoto
  };
}
