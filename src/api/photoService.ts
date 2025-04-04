
import { PhotoItem } from '@/types';
import { apiClient, getAuthHeaders } from './apiClient';

export async function getPhotos(): Promise<PhotoItem[]> {
  return apiClient<PhotoItem[]>('/photos', {
    headers: getAuthHeaders()
  });
}

export async function getPhotosByGameId(gameId: string): Promise<PhotoItem[]> {
  return apiClient<PhotoItem[]>(`/games/${gameId}/photos`, {
    headers: getAuthHeaders()
  });
}

export async function uploadPhoto(formData: FormData): Promise<PhotoItem> {
  // Don't use JSON.stringify for FormData
  return fetch(`${import.meta.env.VITE_API_BASE_URL}/photos`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders()
      // Don't set Content-Type here, it will be set automatically with boundary
    },
    body: formData
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
    return response.json();
  });
}

export async function deletePhoto(photoId: string): Promise<void> {
  return apiClient<void>(`/photos/${photoId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
}
