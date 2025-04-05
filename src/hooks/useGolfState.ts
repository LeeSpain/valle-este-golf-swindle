
import { useGolfStateContext } from '@/context/GolfStateContext';
import { useMemo } from 'react';

export const useGolfState = () => {
  const context = useGolfStateContext();
  
  // Create a fallback context that doesn't change between renders
  const fallbackContext = useMemo(() => ({
    players: [],
    games: [],
    scores: [],
    photos: [],
    weather: null,
    isLoading: false,
    error: "Context not available",
    getNextGame: () => null,
    getPlayerById: () => null,
    getGameById: () => null,
    getScoresByGameId: () => [],
    getScoresByPlayerId: () => [],
    getPhotosByGameId: () => [],
    
    // Player functions
    addPlayer: () => Promise.resolve(false),
    updatePlayer: () => Promise.resolve(false),
    deletePlayer: () => Promise.resolve(false),
    
    // Game functions
    addGame: () => Promise.resolve(false),
    updateGame: () => Promise.resolve(false),
    deleteGame: () => Promise.resolve(false),
    
    // Score functions
    saveScore: () => Promise.resolve(false),
    verifyScore: () => Promise.resolve(false),
    
    // Photo functions
    addPhoto: () => Promise.resolve(false)
  }), []);
  
  if (!context) {
    console.error("useGolfState must be used within a GolfStateProvider");
    return fallbackContext;
  }
  
  return context;
};
