
import { useGolfStateContext } from '@/context/GolfStateContext';

export const useGolfState = () => {
  console.log("useGolfState hook called");
  const context = useGolfStateContext();
  if (!context) {
    console.error("useGolfState must be used within a GolfStateProvider");
    // Return default values to prevent crashes
    return {
      players: [],
      games: [],
      scores: [],
      photos: [],
      weather: null,
      isLoading: false,
      error: "Context not available",
      getNextGame: () => null
    };
  }
  return context;
};
