
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, Game, Score, WeatherData, PhotoItem } from '@/types';
import { getPlayers } from '@/api/playerService';
import { getGames } from '@/api/gameService';
import { getScores } from '@/api/scoreService';
import { getWeather } from '@/api/weatherService';
import { getPhotos } from '@/api/photoService';
import { toast } from '@/hooks/use-toast';

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
      
      setPlayers(playersData);
      setGames(gamesData);
      setScores(scoresData);
      setWeather(weatherData);
      setPhotos(photosData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Data Loading Error",
        description: "Failed to load some data. Please refresh or try again later.",
        variant: "destructive"
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
