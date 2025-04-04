
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
        
        // Add missing functions for Players
        addPlayer: () => Promise.resolve(false),
        updatePlayer: () => Promise.resolve(false),
        deletePlayer: () => Promise.resolve(false),
        
        // Add missing functions for Games
        addGame: () => Promise.resolve(false),
        updateGame: () => Promise.resolve(false),
        deleteGame: () => Promise.resolve(false),
        
        // Add missing functions for Scores
        saveScore: () => Promise.resolve(false),
        verifyScore: () => Promise.resolve(false),
        
        // Add Photo operations
        addPhoto: () => Promise.resolve(false)
      };
    }
    
    console.log("GolfState context retrieved successfully");
    return context;
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
      
      // Add missing functions for Players
      addPlayer: () => Promise.resolve(false),
      updatePlayer: () => Promise.resolve(false),
      deletePlayer: () => Promise.resolve(false),
      
      // Add missing functions for Games
      addGame: () => Promise.resolve(false),
      updateGame: () => Promise.resolve(false),
      deleteGame: () => Promise.resolve(false),
      
      // Add missing functions for Scores
      saveScore: () => Promise.resolve(false),
      verifyScore: () => Promise.resolve(false),
      
      // Add Photo operations
      addPhoto: () => Promise.resolve(false)
    };
  }
};
