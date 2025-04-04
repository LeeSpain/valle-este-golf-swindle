
import { useGolfStateContext } from '@/context/GolfStateContext';
import { getWeather } from '@/api/weatherService';
import { useEffect, useState } from 'react';

export function useWeather() {
  const { weather, isLoading } = useGolfStateContext();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const refreshWeather = async () => {
    setIsRefreshing(true);
    try {
      const freshWeather = await getWeather();
      return freshWeather;
    } catch (error) {
      console.error('Error refreshing weather:', error);
      return null;
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return {
    weather,
    isLoading: isLoading || isRefreshing,
    refreshWeather
  };
}
