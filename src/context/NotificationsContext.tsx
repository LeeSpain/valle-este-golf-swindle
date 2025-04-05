
import React, { createContext, useContext } from 'react';
import { toast } from '@/hooks/use-toast';

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
  const notifyUpcomingGame = (gameDate: string, teeTime: string) => {
    toast({
      title: "Upcoming Game",
      description: `You have a game scheduled for ${gameDate} at ${teeTime}`
    });
  };

  const notifyScoreVerified = (playerName: string, points: number) => {
    toast({
      title: "Score Verified",
      description: `${playerName}'s score of ${points} has been verified`
    });
  };

  const notifyNewScore = (playerName: string, points: number) => {
    toast({
      title: "New Score",
      description: `${playerName} just posted a score of ${points} points`
    });
  };

  const resetNotifications = () => {
    // Just a stub method for now
    console.log("Notifications reset");
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifyUpcomingGame,
        notifyScoreVerified,
        notifyNewScore,
        resetNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => useContext(NotificationsContext);
