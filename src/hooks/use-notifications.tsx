
import { useState } from 'react';

// Removed toast and context dependencies
export function useNotifications() {
  return {
    // Provide empty stub methods to prevent breaking existing code
    notifyUpcomingGame: () => {},
    notifyScoreVerified: () => {},
    notifyNewScore: () => {},
    resetNotifications: () => {}
  };
}
