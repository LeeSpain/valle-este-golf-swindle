
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, Game, Score, WeatherData, PhotoItem } from '@/types';
import { mockPlayers, mockGames, mockScores, mockWeather } from '@/data/mockData';

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
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPlayers(mockPlayers);
      setGames(mockGames);
      setScores(mockScores);
      setWeather(mockWeather);
      // Initialize with empty photos array
      setPhotos([]);
      setIsLoading(false);
    };
    
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
        setPhotos
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
