
import { useContext } from 'react';
import { GolfStateContext } from '@/context/GolfStateContext';

export const useGolfState = () => {
  const context = useContext(GolfStateContext);
  
  if (!context) {
    console.error('useGolfState must be used within a GolfStateProvider');
    // Return default values to prevent application crashes
    return {
      players: [],
      games: [],
      scores: [],
      photos: [],
      weather: null,
      isLoading: false,
      error: 'Context not available',
      getNextGame: () => null,
      getPlayerById: () => null,
      getGameById: () => null,
      getScoresByGameId: () => [],
      getScoresByPlayerId: () => [],
      getPhotosByGameId: () => [],
    };
  }
  
  return context;
};
