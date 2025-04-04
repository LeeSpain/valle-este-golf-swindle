
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
      verifyScore: () => Promise.resolve(false)
    };
  }
  return context;
};
