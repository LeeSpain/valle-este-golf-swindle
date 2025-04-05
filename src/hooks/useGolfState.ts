
import { useGolfStateContext } from '@/context/GolfStateContext';

export const useGolfState = () => {
  try {
    const context = useGolfStateContext();
    
    if (!context) {
      console.error("useGolfState must be used within a GolfStateProvider");
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
    
    return context;
  } catch (error) {
    console.error("Error in useGolfState:", error);
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
