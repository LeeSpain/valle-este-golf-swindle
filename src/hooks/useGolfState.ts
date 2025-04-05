
import { useGolfStateContext } from '@/context/GolfStateContext';
import { useMemo, useCallback } from 'react';

export const useGolfState = () => {
  // Get the raw context
  const context = useGolfStateContext();
  
  // If context is missing, create a stable empty context instead of throwing
  const stableContext = useMemo(() => {
    if (!context) {
      console.error("useGolfState must be used within a GolfStateProvider");
      
      // Return a stable empty context that won't change
      return {
        players: [],
        games: [],
        scores: [],
        photos: [],
        weather: null,
        isLoading: false,
        error: "Context not available",
        setPlayers: () => {},
        setGames: () => {},
        setScores: () => {},
        setPhotos: () => {},
        refreshData: async () => {},
        getNextGame: () => null,
        getPlayerById: () => null,
        getGameById: () => null,
        getScoresByGameId: () => [],
        getScoresByPlayerId: () => [],
        getPhotosByGameId: () => [],
        
        // Player functions
        addPlayer: useCallback(() => Promise.resolve(false), []),
        updatePlayer: useCallback(() => Promise.resolve(false), []),
        deletePlayer: useCallback(() => Promise.resolve(false), []),
        
        // Game functions
        addGame: useCallback(() => Promise.resolve(false), []),
        updateGame: useCallback(() => Promise.resolve(false), []),
        deleteGame: useCallback(() => Promise.resolve(false), []),
        
        // Score functions
        saveScore: useCallback(() => Promise.resolve(false), []),
        verifyScore: useCallback(() => Promise.resolve(false), []),
        
        // Photo functions
        addPhoto: useCallback(() => Promise.resolve(false), [])
      };
    }
    
    // Return the actual context if available
    return context;
  }, [context]);
  
  return stableContext;
};
