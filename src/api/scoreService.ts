
import { Score } from '@/types';
import { apiClient, getAuthHeaders } from './apiClient';

export async function getScores(): Promise<Score[]> {
  return apiClient<Score[]>('/scores', {
    headers: getAuthHeaders()
  });
}

export async function getScoresByGameId(gameId: string): Promise<Score[]> {
  return apiClient<Score[]>(`/games/${gameId}/scores`, {
    headers: getAuthHeaders()
  });
}

export async function getScoresByPlayerId(playerId: string): Promise<Score[]> {
  return apiClient<Score[]>(`/players/${playerId}/scores`, {
    headers: getAuthHeaders()
  });
}

export async function createScore(scoreData: Omit<Score, 'id' | 'createdAt' | 'updatedAt' | 'isVerified'>): Promise<Score> {
  return apiClient<Score>('/scores', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(scoreData)
  });
}

export async function updateScore(scoreId: string, scoreData: Partial<Score>): Promise<Score> {
  return apiClient<Score>(`/scores/${scoreId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(scoreData)
  });
}

export async function verifyScore(scoreId: string): Promise<Score> {
  return apiClient<Score>(`/scores/${scoreId}/verify`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });
}
