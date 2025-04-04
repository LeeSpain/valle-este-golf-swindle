
import { useGolfStateContext } from '@/context/GolfStateContext';

export const useGolfState = () => {
  // Use the context hook directly
  return useGolfStateContext();
};
