
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p2',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    handicap: 18,
    gender: 'female',
    preferredTee: 'red',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'p3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    handicap: 8,
    gender: 'male',
    preferredTee: 'white',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const today = new Date();
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

const mockGames: Game[] = [
  {
    id: 'g1',
    date: nextWeek.toISOString(),
    teeTime: '10:00',
    courseSide: 'front9',
    players: ['p1', 'p2', 'p3'],
    isComplete: false,
    notes: 'Bring extra balls, water hazards are tricky on holes 2 and 7.',
    createdAt: today.toISOString(),
    updatedAt: today.toISOString()
  },
  {
    id: 'g2',
    date: today.toISOString(),
    teeTime: '14:30',
    courseSide: 'back9',
    players: ['p1', 'p3'],
    isComplete: false,
    notes: '',
    createdAt: new Date(today.setDate(today.getDate() - 3)).toISOString(),
    updatedAt: new Date(today.setDate(today.getDate() - 3)).toISOString()
  }
];

const mockScores: Score[] = [
  {
    id: 's1',
    playerId: 'p1',
    gameId: 'g2',
    totalScore: 89,
    totalStablefordPoints: 32,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    holeScores: []
  }
];

const mockWeather: WeatherData = {
  temperature: 28,
  condition: 'sunny',
  windSpeed: 12,
  humidity: 65,
  iconUrl: 'https://cdn.weatherapi.com/weather/64x64/day/113.png'
};

const mockPhotos: PhotoItem[] = [
  {
    id: 'ph1',
    url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa',
    caption: 'Beautiful day at the course',
    uploadedBy: 'p1',
    uploadedAt: new Date().toISOString(),
    likes: 5
  }
];

// Define the shape of our context
interface GolfStateContextType {
  players: Player[];
  games: Game[];
  scores: Score[];
  weather: WeatherData | null;
  photos: PhotoItem[];
  isLoading: boolean;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  setScores: React.Dispatch<React.SetStateAction<Score[]>>;
  setPhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>;
  refreshData: () => Promise<void>;
}

// Create the context with a default empty value
const GolfStateContext = createContext<GolfStateContextType | undefined>(undefined);

// Provider component that wraps the app
export const GolfStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to load all data from API
  const loadData = async () => {
    setIsLoading(true);
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
    } catch (error) {
      console.error('Error loading data:', error);
      
      // Set mock data if API fails
      setPlayers(mockPlayers);
      setGames(mockGames);
      setScores(mockScores);
      setWeather(mockWeather);
      setPhotos(mockPhotos);
      
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
        setPlayers,
        setGames,
        setScores,
        setPhotos,
        refreshData: loadData
      }}
    >
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
