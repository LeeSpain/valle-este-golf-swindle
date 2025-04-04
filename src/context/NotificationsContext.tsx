
import React, { createContext, useContext, useEffect } from 'react';
import { useNotifications } from '@/hooks/use-notifications';

interface NotificationsContextType {
  notifyUpcomingGame: (gameDate: string, teeTime: string) => void;
  notifyScoreVerified: (playerName: string, points: number) => void;
  notifyNewScore: (playerName: string, points: number) => void;
  resetNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notifications = useNotifications();
  
  // Initialize notifications when the app starts
  useEffect(() => {
    // This will trigger the automatic notification checks
    const checkInterval = setInterval(() => {
      notifications.resetNotifications();
    }, 3600000); // Reset every hour to check for new notifications
    
    return () => clearInterval(checkInterval);
  }, [notifications]);
  
  return (
    <NotificationsContext.Provider
      value={{
        notifyUpcomingGame: notifications.notifyUpcomingGame,
        notifyScoreVerified: notifications.notifyScoreVerified,
        notifyNewScore: notifications.notifyNewScore,
        resetNotifications: notifications.resetNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotificationsContext must be used within a NotificationsProvider');
  }
  return context;
};
