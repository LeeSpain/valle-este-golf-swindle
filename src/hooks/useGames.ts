
import { Game } from '@/types';
import { createGame } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { useGolfStateContext } from '@/context/GolfStateContext';

export function useGames() {
  const { games, setGames, scores } = useGolfStateContext();
  
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
  
  const addGame = (gameData: Partial<Game>) => {
    const newGame = createGame(gameData);
    setGames(prev => [...prev, newGame]);
    toast({
      title: "Game Scheduled",
      description: `New game has been scheduled for ${new Date(newGame.date).toLocaleDateString()}.`
    });
    return newGame;
  };
  
  const updateGame = (gameId: string, data: Partial<Game>) => {
    setGames(prev => 
      prev.map(game => 
        game.id === gameId 
          ? { ...game, ...data, updatedAt: new Date() } 
          : game
      )
    );
    toast({
      title: "Game Updated",
      description: `Game details have been updated.`
    });
  };
  
  const deleteGame = (gameId: string) => {
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
    
    const gameToDelete = games.find(g => g.id === gameId);
    setGames(prev => prev.filter(game => game.id !== gameId));
    
    if (gameToDelete) {
      toast({
        title: "Game Deleted",
        description: `Game for ${new Date(gameToDelete.date).toLocaleDateString()} has been removed.`
      });
    }
    
    return true;
  };

  return {
    games,
    getNextGame,
    getLatestCompletedGame,
    addGame,
    updateGame,
    deleteGame
  };
}
