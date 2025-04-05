
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
  
  // Memoize the context data to prevent unnecessary re-renders
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
        addPlayer: async () => false,
        updatePlayer: async () => false,
        deletePlayer: async () => false,
        
        // Game functions
        addGame: async () => false,
        updateGame: async () => false,
        deleteGame: async () => false,
        
        // Score functions
        saveScore: async () => false,
        verifyScore: async () => false,
        
        // Photo functions
        addPhoto: async () => false
      };
    }
    
    // Return the actual context if available
    return context;
  }, [context]);

  // Wrap the CRUD operations with isMounted check to prevent updates after unmount
  const wrappedContext = useMemo(() => {
    if (!stableContext) return stableContext;
    
    return {
      ...stableContext,
      
      // Wrap player operations
      addPlayer: async (data) => {
        if (!isMountedRef.current) return false;
        return stableContext.addPlayer(data);
      },
      updatePlayer: async (id, data) => {
        if (!isMountedRef.current) return false;
        return stableContext.updatePlayer(id, data);
      },
      deletePlayer: async (id) => {
        if (!isMountedRef.current) return false;
        return stableContext.deletePlayer(id);
      },
      
      // Wrap game operations
      addGame: async (data) => {
        if (!isMountedRef.current) return false;
        return stableContext.addGame(data);
      },
      updateGame: async (id, data) => {
        if (!isMountedRef.current) return false;
        return stableContext.updateGame(id, data);
      },
      deleteGame: async (id) => {
        if (!isMountedRef.current) return false;
        return stableContext.deleteGame(id);
      },
      
      // Wrap score operations
      saveScore: async (data) => {
        if (!isMountedRef.current) return false;
        return stableContext.saveScore(data);
      },
      verifyScore: async (id) => {
        if (!isMountedRef.current) return false;
        return stableContext.verifyScore(id);
      },
      
      // Wrap photo operations
      addPhoto: async (data) => {
        if (!isMountedRef.current) return false;
        return stableContext.addPhoto(data);
      }
    };
  }, [stableContext]);
  
  return wrappedContext;
};
