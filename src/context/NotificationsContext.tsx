
import React, { createContext, useContext } from 'react';

interface NotificationsContextType {
  notifyUpcomingGame: (gameDate: string, teeTime: string) => void;
  notifyScoreVerified: (playerName: string, points: number) => void;
  notifyNewScore: (playerName: string, points: number) => void;
  resetNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifyUpcomingGame: () => {},
  notifyScoreVerified: () => {},
  notifyNewScore: () => {},
  resetNotifications: () => {}
});

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <NotificationsContext.Provider
      value={{
        notifyUpcomingGame: () => {},
        notifyScoreVerified: () => {},
        notifyNewScore: () => {},
        resetNotifications: () => {}
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => {
  return {
    notifyUpcomingGame: () => {},
    notifyScoreVerified: () => {},
    notifyNewScore: () => {},
    resetNotifications: () => {}
  };
};
