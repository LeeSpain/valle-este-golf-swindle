
import { useContext } from 'react';
import { GolfStateContext, useGolfStateContext } from '@/context/GolfStateContext';

export const useGolfState = () => {
  // Use the exported hook from the context file
  return useGolfStateContext();
};
