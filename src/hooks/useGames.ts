
import { Game } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useGolfStateContext } from '@/context/GolfStateContext';
import { useContext } from 'react';
import { useNotificationsContext } from '@/context/NotificationsContext';
import { createGame, updateGame, deleteGame } from '@/api/gameService';

export function useGames() {
  const { games, setGames, scores } = useGolfStateContext();
  const notifications = useNotificationsContext();
  
  // Find next game
  const getNextGame = (): Game | null => {
    const now = new Date();
    const upcomingGames = games
      .filter(game => new Date(game.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return upcomingGames.length > 0 ? upcomingGames[0] : null;
  };
  
  // Find latest completed game
  const getLatestCompletedGame = (): Game | null => {
    const now = new Date();
    const completedGames = games
      .filter(game => new Date(game.date) < now && game.isComplete)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return completedGames.length > 0 ? completedGames[0] : null;
  };
  
  // Get all checked-in players for a game
  const getCheckedInPlayers = (gameId: string): string[] => {
    const game = games.find(g => g.id === gameId);
    if (!game || !game.playerStatus) return [];
    
    return game.playerStatus
      .filter(status => status.checkedIn)
      .map(status => status.playerId);
  };
  
  // Updated to accept Partial<Game> instead of requiring specific fields
  const addGame = async (gameData: Partial<Game>) => {
    try {
      // Initialize playerStatus for all selected players if not provided
      if (gameData.players && (!gameData.playerStatus || gameData.playerStatus.length === 0)) {
        gameData.playerStatus = gameData.players.map(playerId => ({
          playerId,
          checkedIn: false,
          hasPaid: false
        }));
      }
      
      const newGame = await createGame(gameData);
      setGames(prev => [...prev, newGame]);
      
      toast({
        title: "Game Scheduled",
        description: `New game has been scheduled for ${new Date(newGame.date).toLocaleDateString()}.`
      });
      
      // Notify about the upcoming game
      if (notifications) {
        notifications.notifyUpcomingGame(newGame.date.toString(), newGame.teeTime);
      }
      
      return newGame;
    } catch (error) {
      console.error('Error adding game:', error);
      return null;
    }
  };
  
  const updateGameById = async (gameId: string, data: Partial<Game>) => {
    try {
      const gameBeforeUpdate = games.find(game => game.id === gameId);
      const updatedGame = await updateGame(gameId, data);
      
      setGames(prev => 
        prev.map(game => 
          game.id === gameId ? updatedGame : game
        )
      );
      
      // Different toast messages based on what was updated
      if (data.isComplete) {
        toast({
          title: "Game Completed",
          description: `The game has been marked as complete.`
        });
      } else {
        toast({
          title: "Game Updated",
          description: `Game details have been updated.`
        });
      }
      
      // If date or tee time changed, send notification
      if (notifications && gameBeforeUpdate) {
        if (data.date !== gameBeforeUpdate.date || data.teeTime !== gameBeforeUpdate.teeTime) {
          notifications.notifyUpcomingGame(
            updatedGame.date.toString(), 
            updatedGame.teeTime
          );
        }
      }
      
      return updatedGame;
    } catch (error) {
      console.error('Error updating game:', error);
      return null;
    }
  };
  
  const deleteGameById = async (gameId: string) => {
    try {
      // Check if game has scores
      const gameScores = scores.filter(score => score.gameId === gameId);
      
      if (gameScores.length > 0) {
        toast({
          title: "Cannot Delete Game",
          description: "This game has scores recorded and cannot be deleted.",
          variant: "destructive"
        });
        return false;
      }
      
      await deleteGame(gameId);
      const gameToDelete = games.find(g => g.id === gameId);
      setGames(prev => prev.filter(game => game.id !== gameId));
      
      if (gameToDelete) {
        toast({
          title: "Game Deleted",
          description: `Game for ${new Date(gameToDelete.date).toLocaleDateString()} has been removed.`
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting game:', error);
      return false;
    }
  };

  return {
    games,
    getNextGame,
    getLatestCompletedGame,
    getCheckedInPlayers,
    addGame,
    updateGame: updateGameById,
    deleteGame: deleteGameById
  };
}
