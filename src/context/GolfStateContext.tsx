
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, Game, Score, WeatherData, PhotoItem } from '@/types';
import { getPlayers } from '@/api/playerService';
import { getGames } from '@/api/gameService';
import { getScores } from '@/api/scoreService';
import { getWeather } from '@/api/weatherService';
import { getPhotos } from '@/api/photoService';
import { toast } from '@/hooks/use-toast';
import { createPlayer, updatePlayer, deletePlayer } from '@/api/playerService';
import { createGame, updateGame, deleteGame } from '@/api/gameService';
import { createScore, updateScore, verifyScore as verifyScoreApi } from '@/api/scoreService';

// Mock data for fallback
const mockPlayers: Player[] = [
  {
    id: 'p1',
    name: 'John Doe',
    email: 'john@example.com',
    handicap: 12,
    gender: 'male',
    preferredTee: 'yellow',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'p2',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    handicap: 18,
    gender: 'female',
    preferredTee: 'red',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'p3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    handicap: 8,
    gender: 'male',
    preferredTee: 'yellow',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const today = new Date();
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

const mockGames: Game[] = [
  {
    id: 'g1',
    date: nextWeek,
    teeTime: '10:00',
    courseSide: 'front9',
    players: ['p1', 'p2', 'p3'],
    playerStatus: [
      { playerId: 'p1', checkedIn: false, hasPaid: false },
      { playerId: 'p2', checkedIn: false, hasPaid: false },
      { playerId: 'p3', checkedIn: false, hasPaid: false }
    ],
    isComplete: false,
    isVerified: false,
    notes: 'Bring extra balls, water hazards are tricky on holes 2 and 7.',
    createdAt: today,
    updatedAt: today
  },
  {
    id: 'g2',
    date: today,
    teeTime: '14:30',
    courseSide: 'back9',
    players: ['p1', 'p3'],
    playerStatus: [
      { playerId: 'p1', checkedIn: false, hasPaid: false },
      { playerId: 'p3', checkedIn: false, hasPaid: false }
    ],
    isComplete: false,
    isVerified: false,
    notes: '',
    createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
  }
];

const mockScores: Score[] = [
  {
    id: 's1',
    playerId: 'p1',
    gameId: 'g2',
    holes: [], 
    totalStrokes: 89,
    totalNetStrokes: 79,
    totalStablefordPoints: 32,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockWeather: WeatherData = {
  temperature: 28,
  condition: 'sunny',
  windSpeed: 12,
  iconUrl: 'https://cdn.weatherapi.com/weather/64x64/day/113.png'
};

const mockPhotos: PhotoItem[] = [
  {
    id: 'ph1',
    url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa',
    caption: 'Beautiful day at the course',
    uploadedBy: 'p1',
    gameId: 'g1',
    createdAt: new Date()
  }
];

// Define the shape of our context
interface GolfStateContextType {
  players: Player[];
  games: Game[];
  scores: Score[];
  photos: PhotoItem[];
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  setScores: React.Dispatch<React.SetStateAction<Score[]>>;
  setPhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>;
  refreshData: () => Promise<void>;
  getNextGame: () => Game | null;
  getPlayerById: (id: string) => Player | null;
  getGameById: (id: string) => Game | null;
  getScoresByGameId: (gameId: string) => Score[];
  getScoresByPlayerId: (playerId: string) => Score[];
  getPhotosByGameId: (gameId: string) => PhotoItem[];
  addPhoto: (photo: Partial<PhotoItem>) => Promise<boolean>;
  addGame: (game: Partial<Game>) => Promise<boolean>;
  updateGame: (gameId: string, data: Partial<Game>) => Promise<boolean>;
  deleteGame: (gameId: string) => Promise<boolean>;
  addPlayer: (player: Partial<Player>) => Promise<boolean>;
  updatePlayer: (playerId: string, data: Partial<Player>) => Promise<boolean>;
  deletePlayer: (playerId: string) => Promise<boolean>;
  saveScore: (score: Partial<Score>) => Promise<boolean>;
  verifyScore: (scoreId: string) => Promise<boolean>;
}

// Create the context with a default value
export const GolfStateContext = createContext<GolfStateContextType | undefined>(undefined);

// Provider component that wraps the app
export const GolfStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with empty arrays to prevent null references
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Helper functions
  const getNextGame = () => {
    if (games.length === 0) return null;
    
    const now = new Date();
    const futureGames = games
      .filter(game => new Date(game.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return futureGames.length > 0 ? futureGames[0] : null;
  };
  
  const getPlayerById = (id: string) => {
    return players.find(player => player.id === id) || null;
  };
  
  const getGameById = (id: string) => {
    return games.find(game => game.id === id) || null;
  };
  
  const getScoresByGameId = (gameId: string) => {
    return scores.filter(score => score.gameId === gameId);
  };
  
  const getScoresByPlayerId = (playerId: string) => {
    return scores.filter(score => score.playerId === playerId);
  };
  
  const getPhotosByGameId = (gameId: string) => {
    return photos.filter(photo => photo.gameId === gameId);
  };
  
  // CRUD operations for Players
  const addPlayer = async (player: Partial<Player>): Promise<boolean> => {
    try {
      const newPlayer = await createPlayer(player);
      setPlayers(prev => [...prev, newPlayer]);
      
      toast({
        title: "Player Added",
        description: `${newPlayer.name} has been added to the swindle.`
      });
      
      return true;
    } catch (error) {
      console.error('Error adding player:', error);
      return false;
    }
  };
  
  const updatePlayerById = async (playerId: string, data: Partial<Player>): Promise<boolean> => {
    try {
      const updatedPlayer = await updatePlayer(playerId, data);
      
      setPlayers(prev => 
        prev.map(player => 
          player.id === playerId ? updatedPlayer : player
        )
      );
      
      toast({
        title: "Player Updated",
        description: `${updatedPlayer.name}'s details have been updated.`
      });
      
      return true;
    } catch (error) {
      console.error('Error updating player:', error);
      return false;
    }
  };
  
  const deletePlayerById = async (playerId: string): Promise<boolean> => {
    try {
      await deletePlayer(playerId);
      const playerToDelete = players.find(p => p.id === playerId);
      
      setPlayers(prev => prev.filter(player => player.id !== playerId));
      
      if (playerToDelete) {
        toast({
          title: "Player Removed",
          description: `${playerToDelete.name} has been removed from the swindle.`
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting player:', error);
      return false;
    }
  };
  
  // CRUD operations for Games
  const addGameOperation = async (game: Partial<Game>): Promise<boolean> => {
    try {
      const newGame = await createGame(game);
      setGames(prev => [...prev, newGame]);
      
      toast({
        title: "Game Scheduled",
        description: `New game has been scheduled for ${new Date(newGame.date).toLocaleDateString()}.`
      });
      
      return true;
    } catch (error) {
      console.error('Error adding game:', error);
      return false;
    }
  };
  
  const updateGameById = async (gameId: string, data: Partial<Game>): Promise<boolean> => {
    try {
      const updatedGame = await updateGame(gameId, data);
      
      setGames(prev => 
        prev.map(game => 
          game.id === gameId ? updatedGame : game
        )
      );
      
      toast({
        title: "Game Updated",
        description: `Game details have been updated.`
      });
      
      return true;
    } catch (error) {
      console.error('Error updating game:', error);
      return false;
    }
  };
  
  const deleteGameById = async (gameId: string): Promise<boolean> => {
    try {
      await deleteGame(gameId);
      
      setGames(prev => prev.filter(game => game.id !== gameId));
      
      toast({
        title: "Game Deleted",
        description: `Game has been removed.`
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting game:', error);
      return false;
    }
  };
  
  // Operations for Scores
  const saveScoreOperation = async (score: Partial<Score>): Promise<boolean> => {
    try {
      let savedScore;
      
      if (score.id) {
        savedScore = await updateScore(score.id, score);
        setScores(prev => prev.map(s => s.id === score.id ? savedScore : s));
      } else {
        savedScore = await createScore(score as any); // Cast to any to bypass TypeScript error
        setScores(prev => [...prev, savedScore]);
      }
      
      toast({
        title: "Score Saved",
        description: "The player's score has been recorded."
      });
      
      return true;
    } catch (error) {
      console.error('Error saving score:', error);
      return false;
    }
  };
  
  const verifyScoreOperation = async (scoreId: string): Promise<boolean> => {
    try {
      const verifiedScore = await verifyScoreApi(scoreId);
      
      setScores(prev => 
        prev.map(score => 
          score.id === scoreId ? { ...score, isVerified: true } : score
        )
      );
      
      toast({
        title: "Score Verified",
        description: "The score has been verified and is now official."
      });
      
      return true;
    } catch (error) {
      console.error('Error verifying score:', error);
      return false;
    }
  };
  
  // Photo operations (dummy implementation for now)
  const addPhotoOperation = async (photo: Partial<PhotoItem>): Promise<boolean> => {
    try {
      // In a real app, this would call an API
      const newPhoto = {
        id: `ph${Date.now()}`,
        url: photo.url || 'https://placeholder.com/150',
        caption: photo.caption || '',
        uploadedBy: photo.uploadedBy || 'anonymous',
        gameId: photo.gameId || '',
        createdAt: new Date()
      };
      
      setPhotos(prev => [...prev, newPhoto as PhotoItem]);
      
      toast({
        title: "Photo Added",
        description: "Your photo has been uploaded."
      });
      
      return true;
    } catch (error) {
      console.error('Error adding photo:', error);
      return false;
    }
  };
  
  // Function to load all data from API
  const loadData = async () => {
    console.log("GolfStateProvider: loadData called");
    setIsLoading(true);
    setError(null);
    
    try {
      // Load data in parallel for better performance
      const [playersData, gamesData, scoresData, weatherData, photosData] = await Promise.all([
        getPlayers(),
        getGames(),
        getScores(),
        getWeather(),
        getPhotos()
      ]);
      
      console.log("API data loaded:", { 
        players: playersData?.length || 0,
        games: gamesData?.length || 0, 
        scores: scoresData?.length || 0
      });
      
      // Set data from API if it was successful
      setPlayers(playersData || []);
      setGames(gamesData || []);
      setScores(scoresData || []);
      setWeather(weatherData || null);
      setPhotos(photosData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      
      // Set mock data if API fails
      setPlayers(mockPlayers);
      setGames(mockGames);
      setScores(mockScores);
      setWeather(mockWeather);
      setPhotos(mockPhotos);
      
      // Set error state
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      toast({
        title: "Using Demo Data",
        description: "Connected to demo mode since API is unavailable.",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
      console.log("GolfStateProvider: finished loading data");
    }
  };
  
  // Load initial data
  useEffect(() => {
    console.log("GolfStateProvider initializing...");
    loadData();
  }, []);

  // Create value object with all context properties
  const contextValue: GolfStateContextType = {
    players, 
    games, 
    scores, 
    weather, 
    photos, 
    isLoading,
    error,
    setPlayers,
    setGames,
    setScores,
    setPhotos,
    refreshData: loadData,
    getNextGame,
    getPlayerById,
    getGameById,
    getScoresByGameId,
    getScoresByPlayerId,
    getPhotosByGameId,
    addPhoto: addPhotoOperation,
    addGame: addGameOperation,
    updateGame: updateGameById,
    deleteGame: deleteGameById,
    addPlayer,
    updatePlayer: updatePlayerById,
    deletePlayer: deletePlayerById,
    saveScore: saveScoreOperation,
    verifyScore: verifyScoreOperation
  };

  console.log("GolfStateProvider rendering with state:", { 
    playersCount: players.length,
    gamesCount: games.length,
    isLoading
  });

  return (
    <GolfStateContext.Provider value={contextValue}>
      {children}
    </GolfStateContext.Provider>
  );
};

// Custom hook to use the context
export const useGolfStateContext = () => {
  const context = useContext(GolfStateContext);
  if (context === undefined) {
    throw new Error('useGolfStateContext must be used within a GolfStateProvider');
  }
  return context;
};
