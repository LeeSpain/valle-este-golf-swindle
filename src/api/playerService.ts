
import { Player } from '@/types';
import { apiClient, getAuthHeaders } from './apiClient';

export async function getPlayers(): Promise<Player[]> {
  return apiClient<Player[]>('/players', {
    headers: getAuthHeaders()
  });
}

export async function getPlayerById(playerId: string): Promise<Player> {
  return apiClient<Player>(`/players/${playerId}`, {
    headers: getAuthHeaders()
  });
}

// Updated to accept Partial<Player> instead of requiring all fields
export async function createPlayer(playerData: Partial<Player>): Promise<Player> {
  return apiClient<Player>('/players', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(playerData)
  });
}

export async function updatePlayer(playerId: string, playerData: Partial<Player>): Promise<Player> {
  return apiClient<Player>(`/players/${playerId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(playerData)
  });
}

export async function deletePlayer(playerId: string): Promise<void> {
  return apiClient<void>(`/players/${playerId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
}
