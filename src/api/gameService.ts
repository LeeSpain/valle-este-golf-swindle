
import { Game } from '@/types';
import { apiClient, getAuthHeaders } from './apiClient';

export async function getGames(): Promise<Game[]> {
  return apiClient<Game[]>('/games', {
    headers: getAuthHeaders()
  });
}

export async function getGameById(gameId: string): Promise<Game> {
  return apiClient<Game>(`/games/${gameId}`, {
    headers: getAuthHeaders()
  });
}

export async function createGame(gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt' | 'isVerified' | 'isComplete'>): Promise<Game> {
  return apiClient<Game>('/games', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(gameData)
  });
}

export async function updateGame(gameId: string, gameData: Partial<Game>): Promise<Game> {
  return apiClient<Game>(`/games/${gameId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(gameData)
  });
}

export async function deleteGame(gameId: string): Promise<void> {
  return apiClient<void>(`/games/${gameId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
}
