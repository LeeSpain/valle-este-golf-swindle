
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, Game, Score, WeatherData, PhotoItem } from '@/types';
import { getPlayers } from '@/api/playerService';
import { getGames } from '@/api/gameService';
import { getScores } from '@/api/scoreService';
import { getWeather } from '@/api/weatherService';
import { getPhotos } from '@/api/photoService';
import { toast } from '@/hooks/use-toast';

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
  addPhoto?: (photo: Omit<PhotoItem, 'id' | 'createdAt'>) => Promise<boolean>;
  addGame?: (game: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateGame?: (gameId: string, data: Partial<Game>) => Promise<boolean>;
  deleteGame?: (gameId: string) => Promise<boolean>;
  addPlayer?: (player: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updatePlayer?: (playerId: string, data: Partial<Player>) => Promise<boolean>;
  deletePlayer?: (playerId: string) => Promise<boolean>;
  saveScore?: (score: Omit<Score, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  verifyScore?: (scoreId: string) => Promise<boolean>;
}

// Create the context with a default empty value
export const GolfStateContext = createContext<GolfStateContextType | undefined>(undefined);

// Provider component that wraps the app
export const GolfStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  
  // Function to load all data from API
  const loadData = async () => {
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
      
      // Set data from API if it was successful
      setPlayers(playersData || mockPlayers);
      setGames(gamesData || mockGames);
      setScores(scoresData || mockScores);
      setWeather(weatherData || mockWeather);
      setPhotos(photosData || mockPhotos);
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
    }
  };
  
  // Load initial data
  useEffect(() => {
    console.log("GolfStateProvider initializing...");
    loadData();
  }, []);

  return (
    <GolfStateContext.Provider 
      value={{ 
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
        getPhotosByGameId
      }}
    >
      {children}
    </GolfStateContext.Provider>
  );
};

// Custom hook to use the context - explicitly export this
export const useGolfStateContext = () => {
  const context = useContext(GolfStateContext);
  if (context === undefined) {
    throw new Error('useGolfStateContext must be used within a GolfStateProvider');
  }
  return context;
};
