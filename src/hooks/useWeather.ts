
import { useGolfStateContext } from '@/context/GolfStateContext';

export function useWeather() {
  const { weather, isLoading } = useGolfStateContext();
  
  return {
    weather,
    isLoading
  };
}
