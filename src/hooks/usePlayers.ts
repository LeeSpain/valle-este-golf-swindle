
import { Player } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useGolfStateContext } from '@/context/GolfStateContext';
import { createPlayer, updatePlayer, deletePlayer } from '@/api/playerService';
import { useCallback } from 'react';

export function usePlayers() {
  const { players, setPlayers } = useGolfStateContext();
  
  const addPlayer = useCallback(async (playerData: Partial<Player>) => {
    try {
      console.log("Adding player:", playerData);
      const newPlayer = await createPlayer(playerData);
      
      if (!newPlayer) {
        throw new Error("Failed to create player");
      }
      
      // Update state only after API call succeeds
      setPlayers(prev => [...prev, newPlayer]);
      
      toast({
        title: "Player Added",
        description: `${newPlayer.name} has been added to the swindle.`
      });
      
      return newPlayer;
    } catch (error) {
      console.error('Error adding player:', error);
      
      toast({
        title: "Error",
        description: "Failed to add player. Please try again.",
        variant: "destructive"
      });
      
      return null;
    }
  }, [setPlayers]);
  
  const updatePlayerById = useCallback(async (playerId: string, data: Partial<Player>) => {
    try {
      console.log("Updating player:", playerId, data);
      const updatedPlayer = await updatePlayer(playerId, data);
      
      if (!updatedPlayer) {
        throw new Error("Failed to update player");
      }
      
      // Update state only after API call succeeds
      setPlayers(prev => 
        prev.map(player => 
          player.id === playerId ? updatedPlayer : player
        )
      );
      
      toast({
        title: "Player Updated",
        description: `${updatedPlayer.name}'s details have been updated.`
      });
      
      return updatedPlayer;
    } catch (error) {
      console.error('Error updating player:', error);
      
      toast({
        title: "Error",
        description: "Failed to update player. Please try again.",
        variant: "destructive"
      });
      
      return null;
    }
  }, [setPlayers]);
  
  const deletePlayerById = useCallback(async (playerId: string) => {
    try {
      console.log("Deleting player:", playerId);
      
      // Cache player name before deletion
      const playerToDelete = players.find(p => p.id === playerId);
      if (!playerToDelete) {
        console.error('Player not found:', playerId);
        return false;
      }
      
      await deletePlayer(playerId);
      
      // Update state only after API call succeeds
      setPlayers(prev => prev.filter(player => player.id !== playerId));
      
      toast({
        title: "Player Removed",
        description: `${playerToDelete.name} has been removed from the swindle.`
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting player:', error);
      
      toast({
        title: "Error",
        description: "Failed to delete player. Please try again.",
        variant: "destructive"
      });
      
      return false;
    }
  }, [players, setPlayers]);
  
  return {
    players,
    addPlayer,
    updatePlayer: updatePlayerById,
    deletePlayer: deletePlayerById
  };
}
