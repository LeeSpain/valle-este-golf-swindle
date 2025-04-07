
import { useCallback } from 'react';
import { useGolfState } from './useGolfState';
import { Game, Player } from '@/types';
import { gameService } from '@/api/gameService';
import { toast } from '@/hooks/use-toast';

export function useGames() {
  const { 
    games, 
    setGames, 
    addGame: addGameToState, 
    updateGame: updateGameInState,
    deleteGame: deleteGameFromState,
    isLoading 
  } = useGolfState();

  // Retrieve games
  const getGame = useCallback((gameId: string) => {
    const game = games.find(g => g.id === gameId);
    return game || null;
  }, [games]);

  // Add a new game
  const addGame = useCallback(async (gameData: Partial<Game>) => {
    try {
      console.log('Adding new game:', gameData);
      
      // Create with API
      const newGame = await gameService.createGame(gameData);
      
      if (newGame) {
        // Update local state
        addGameToState(newGame);
        
        // Show success notification
        toast({
          title: "Game Created",
          description: "New game has been scheduled successfully"
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding game:', error);
      
      // Show error notification
      toast({
        title: "Error",
        description: "Failed to create game",
        variant: "destructive"
      });
      
      return false;
    }
  }, [addGameToState]);

  // Update an existing game
  const updateGame = useCallback(async (gameId: string, gameData: Partial<Game>) => {
    try {
      console.log('Updating game:', gameId, gameData);
      
      // Update with API
      const updatedGame = await gameService.updateGame(gameId, gameData);
      
      if (updatedGame) {
        // Update local state
        updateGameInState(gameId, updatedGame);
        
        // Show success notification
        toast({
          title: "Game Updated",
          description: "Game details have been updated successfully"
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating game:', error);
      
      // Show error notification
      toast({
        title: "Error",
        description: "Failed to update game",
        variant: "destructive"
      });
      
      return false;
    }
  }, [updateGameInState]);

  // Delete a game
  const deleteGame = useCallback(async (gameId: string) => {
    try {
      console.log('Deleting game:', gameId);
      
      // Delete with API
      await gameService.deleteGame(gameId);
      
      // Update local state
      deleteGameFromState(gameId);
      
      // Show success notification
      toast({
        title: "Game Deleted",
        description: "Game has been removed successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting game:', error);
      
      // Show error notification
      toast({
        title: "Error",
        description: "Failed to delete game",
        variant: "destructive"
      });
      
      return false;
    }
  }, [deleteGameFromState]);

  // Add a player to a game
  const addPlayerToGame = useCallback(async (gameId: string, playerId: string) => {
    try {
      console.log('Adding player to game:', gameId, playerId);
      
      // Update with API
      const success = await gameService.addPlayerToGame(gameId, playerId);
      
      if (success) {
        // Get updated game data
        const updatedGame = await gameService.getGame(gameId);
        
        if (updatedGame) {
          // Update local state
          updateGameInState(gameId, updatedGame);
          
          // Show success notification
          toast({
            title: "Player Added",
            description: "Player has been added to the game"
          });
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error adding player to game:', error);
      
      // Show error notification
      toast({
        title: "Error",
        description: "Failed to add player to game",
        variant: "destructive"
      });
      
      return false;
    }
  }, [updateGameInState]);

  // Remove a player from a game
  const removePlayerFromGame = useCallback(async (gameId: string, playerId: string) => {
    try {
      console.log('Removing player from game:', gameId, playerId);
      
      // Update with API
      const success = await gameService.removePlayerFromGame(gameId, playerId);
      
      if (success) {
        // Get updated game data
        const updatedGame = await gameService.getGame(gameId);
        
        if (updatedGame) {
          // Update local state
          updateGameInState(gameId, updatedGame);
          
          // Show success notification
          toast({
            title: "Player Removed",
            description: "Player has been removed from the game"
          });
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error removing player from game:', error);
      
      // Show error notification
      toast({
        title: "Error",
        description: "Failed to remove player from game",
        variant: "destructive"
      });
      
      return false;
    }
  }, [updateGameInState]);

  return {
    games,
    getGame,
    addGame,
    updateGame,
    deleteGame,
    addPlayerToGame,
    removePlayerFromGame,
    isLoading
  };
}
