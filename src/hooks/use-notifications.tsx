
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGolfStateContext } from '@/context/GolfStateContext';

type NotificationType = 'upcoming-game' | 'score-verified' | 'new-score';

interface NotificationState {
  upcomingGameChecked: boolean;
  scoreVerifiedChecked: boolean;
  newScoreChecked: boolean;
}

export function useNotifications() {
  const { toast } = useToast();
  const { games, scores, players } = useGolfStateContext();
  const [notificationState, setNotificationState] = useState<NotificationState>({
    upcomingGameChecked: false,
    scoreVerifiedChecked: false,
    newScoreChecked: false,
  });

  const showNotification = (type: NotificationType, message: string, details: string) => {
    toast({
      title: message,
      description: details,
      duration: 5000,
    });
  };

  // Check for upcoming games
  useEffect(() => {
    if (notificationState.upcomingGameChecked) return;

    // Find next game directly instead of using useGames hook
    const now = new Date();
    const upcomingGames = games
      .filter(game => new Date(game.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const nextGame = upcomingGames.length > 0 ? upcomingGames[0] : null;

    if (nextGame) {
      const gameDate = new Date(nextGame.date);
      const today = new Date();
      const diffTime = Math.abs(gameDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Notify for games within the next 2 days
      if (diffDays <= 2 && !notificationState.upcomingGameChecked) {
        const formattedDate = gameDate.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
        });
        
        showNotification(
          'upcoming-game',
          'Upcoming Game',
          `You have a game scheduled for ${formattedDate} at ${nextGame.teeTime}`
        );
        
        setNotificationState(prev => ({ ...prev, upcomingGameChecked: true }));
      }
    }
  }, [games, notificationState.upcomingGameChecked, toast]);

  // Check for newly verified scores
  useEffect(() => {
    if (notificationState.scoreVerifiedChecked) return;

    const verifiedScores = scores.filter(score => score.isVerified);
    
    if (verifiedScores.length > 0 && !notificationState.scoreVerifiedChecked) {
      const recentScores = verifiedScores
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3);
      
      if (recentScores.length > 0) {
        const playerNames = recentScores.map(score => {
          const player = players.find(p => p.id === score.playerId);
          return player ? player.name : 'Unknown Player';
        }).join(', ');
        
        showNotification(
          'score-verified',
          'Scores Verified',
          `New scores have been verified for: ${playerNames}`
        );
        
        setNotificationState(prev => ({ ...prev, scoreVerifiedChecked: true }));
      }
    }
  }, [scores, players, notificationState.scoreVerifiedChecked, toast]);

  return {
    // Method to manually show notifications
    notifyUpcomingGame: (gameDate: string, teeTime: string) => {
      showNotification(
        'upcoming-game',
        'Upcoming Game',
        `You have a game scheduled for ${new Date(gameDate).toLocaleDateString()} at ${teeTime}`
      );
    },
    
    notifyScoreVerified: (playerName: string, points: number) => {
      showNotification(
        'score-verified',
        'Score Verified',
        `${playerName}'s score of ${points} points has been verified`
      );
    },
    
    notifyNewScore: (playerName: string, points: number) => {
      showNotification(
        'new-score',
        'New Score Submitted',
        `${playerName} has submitted a new score of ${points} points`
      );
    },
    
    // Reset notification state to allow showing notifications again
    resetNotifications: () => {
      setNotificationState({
        upcomingGameChecked: false,
        scoreVerifiedChecked: false,
        newScoreChecked: false,
      });
    }
  };
}
