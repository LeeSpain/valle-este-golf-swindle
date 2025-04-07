
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

// Updated to accept Partial<Game> instead of requiring all fields
export async function createGame(gameData: Partial<Game>): Promise<Game> {
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

// Add player management functions that were referenced in useGames.ts
export async function addPlayerToGame(gameId: string, playerId: string): Promise<boolean> {
  await apiClient<void>(`/games/${gameId}/players/${playerId}`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return true;
}

export async function removePlayerFromGame(gameId: string, playerId: string): Promise<boolean> {
  await apiClient<void>(`/games/${gameId}/players/${playerId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return true;
}

export async function getGame(gameId: string): Promise<Game> {
  return getGameById(gameId);
}

// Create a unified gameService object that matches what's being imported
export const gameService = {
  getGames,
  getGameById,
  getGame,
  createGame,
  updateGame,
  deleteGame,
  addPlayerToGame,
  removePlayerFromGame
};
