
import { toast } from './use-toast';

// Simplified notifications hook that uses the toast component
export function useNotifications() {
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

  return {
    notifyUpcomingGame,
    notifyScoreVerified,
    notifyNewScore,
    resetNotifications
  };
}
