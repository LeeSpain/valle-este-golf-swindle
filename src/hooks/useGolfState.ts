
import { useGolfStateContext } from '@/context/GolfStateContext';

export const useGolfState = () => {
  console.log("useGolfState hook called");
  
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
  
  console.log("GolfState context retrieved successfully, isLoading:", context.isLoading);
  return context;
};
