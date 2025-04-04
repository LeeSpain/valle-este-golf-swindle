
import { useGolfStateContext } from '@/context/GolfStateContext';
import { usePlayers } from './usePlayers';
import { useGames } from './useGames';
import { useScores } from './useScores';
import { usePhotos } from './usePhotos';
import { useWeather } from './useWeather';

export function useGolfState() {
  const { isLoading } = useGolfStateContext();
  const playerHooks = usePlayers();
  const gameHooks = useGames();
  const scoreHooks = useScores();
  const photoHooks = usePhotos();
  const weatherHooks = useWeather();
  
  // Combine all the hooks into a single object
  return {
    // Player-related
    players: playerHooks.players,
    addPlayer: playerHooks.addPlayer,
    updatePlayer: playerHooks.updatePlayer,
    deletePlayer: playerHooks.deletePlayer,
    
    // Game-related
    games: gameHooks.games,
    getNextGame: gameHooks.getNextGame,
    getLatestCompletedGame: gameHooks.getLatestCompletedGame,
    addGame: gameHooks.addGame,
    updateGame: gameHooks.updateGame,
    deleteGame: gameHooks.deleteGame,
    
    // Score-related
    scores: scoreHooks.scores,
    saveScore: scoreHooks.saveScore,
    verifyScore: scoreHooks.verifyScore,
    
    // Photo-related
    photos: photoHooks.photos,
    addPhoto: photoHooks.addPhoto,
    deletePhoto: photoHooks.deletePhoto,
    
    // Weather-related
    weather: weatherHooks.weather,
    
    // Loading state
    isLoading
  };
}
