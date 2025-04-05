
import { Player } from '@/types';
import { apiClient, getAuthHeaders } from './apiClient';

export async function getPlayers(): Promise<Player[]> {
  try {
    const result = await apiClient<Player[]>('/players', {
      headers: getAuthHeaders()
    });
    return result || [];
  } catch (error) {
    console.error("Failed to get players:", error);
    return [];
  }
}

export async function getPlayerById(playerId: string): Promise<Player | null> {
  try {
    const result = await apiClient<Player>(`/players/${playerId}`, {
      headers: getAuthHeaders()
    });
    return result;
  } catch (error) {
    console.error(`Failed to get player with ID ${playerId}:`, error);
    return null;
  }
}

// Updated to accept Partial<Player> instead of requiring all fields
export async function createPlayer(playerData: Partial<Player>): Promise<Player> {
  try {
    const result = await apiClient<Player>('/players', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(playerData)
    });
    
    if (!result) {
      throw new Error("Failed to create player");
    }
    
    return result;
  } catch (error) {
    console.error("Failed to create player:", error);
    throw new Error("Failed to create player");
  }
}

export async function updatePlayer(playerId: string, playerData: Partial<Player>): Promise<Player> {
  try {
    const result = await apiClient<Player>(`/players/${playerId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(playerData)
    });
    
    if (!result) {
      throw new Error("Failed to update player");
    }
    
    return result;
  } catch (error) {
    console.error(`Failed to update player with ID ${playerId}:`, error);
    throw new Error("Failed to update player");
  }
}

export async function deletePlayer(playerId: string): Promise<boolean> {
  try {
    await apiClient<void>(`/players/${playerId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return true;
  } catch (error) {
    console.error(`Failed to delete player with ID ${playerId}:`, error);
    return false;
  }
}
