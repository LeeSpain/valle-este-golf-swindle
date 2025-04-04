
import { useGolfStateContext } from '@/context/GolfStateContext';

export const useGolfState = () => {
  console.log("useGolfState hook called");
  
  try {
    const context = useGolfStateContext();
    
    if (!context) {
      console.error("useGolfState must be used within a GolfStateProvider");
      // Return default values to prevent crashes, including empty function implementations
      return {
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
      };
    }
    
    // Add additional safety checks for critical functions
    const safeContext = {
      ...context,
      getNextGame: context.getNextGame || (() => null),
      getPlayerById: context.getPlayerById || (() => null),
      getGameById: context.getGameById || (() => null),
      getScoresByGameId: context.getScoresByGameId || (() => []),
      getScoresByPlayerId: context.getScoresByPlayerId || (() => []),
      getPhotosByGameId: context.getPhotosByGameId || (() => []),
      
      // Ensure these functions exist
      addPlayer: context.addPlayer || (() => Promise.resolve(false)),
      updatePlayer: context.updatePlayer || (() => Promise.resolve(false)),
      deletePlayer: context.deletePlayer || (() => Promise.resolve(false)),
      
      addGame: context.addGame || (() => Promise.resolve(false)),
      updateGame: context.updateGame || (() => Promise.resolve(false)),
      deleteGame: context.deleteGame || (() => Promise.resolve(false)),
      
      saveScore: context.saveScore || (() => Promise.resolve(false)),
      verifyScore: context.verifyScore || (() => Promise.resolve(false)),
      
      addPhoto: context.addPhoto || (() => Promise.resolve(false))
    };
    
    console.log("GolfState context retrieved successfully");
    return safeContext;
  } catch (error) {
    console.error("Error in useGolfState hook:", error);
    // Return default values in case of any error
    return {
      players: [],
      games: [],
      scores: [],
      photos: [],
      weather: null,
      isLoading: false,
      error: error instanceof Error ? error.message : "Unknown error in useGolfState",
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
};
