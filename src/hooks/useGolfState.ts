
import { useGolfStateContext } from '@/context/GolfStateContext';
import { useMemo, useCallback, useRef, useEffect } from 'react';

export const useGolfState = () => {
  // Track if the hook is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = true;
    console.log("useGolfState mounted");
    
    return () => {
      isMountedRef.current = false;
      console.log("useGolfState unmounted");
    };
  }, []);
  
  // Get the raw context
  const context = useGolfStateContext();
  
  // If context is missing, create a stable empty context instead of throwing
  const stableContext = useMemo(() => {
    if (!context && isMountedRef.current) {
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
      };
    }
    
    // Return the actual context if available
    return context;
  }, [context]);
  
  return stableContext;
};
