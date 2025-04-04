
import { Player } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useGolfStateContext } from '@/context/GolfStateContext';
import { createPlayer, updatePlayer, deletePlayer } from '@/api/playerService';

export function usePlayers() {
  const { players, setPlayers } = useGolfStateContext();
  
  const addPlayer = async (playerData: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newPlayer = await createPlayer(playerData);
      setPlayers(prev => [...prev, newPlayer]);
      
      toast({
        title: "Player Added",
        description: `${newPlayer.name} has been added to the swindle.`
      });
      
      return newPlayer;
    } catch (error) {
      console.error('Error adding player:', error);
      return null;
    }
  };
  
  const updatePlayerById = async (playerId: string, data: Partial<Player>) => {
    try {
      const updatedPlayer = await updatePlayer(playerId, data);
      
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
      return null;
    }
  };
  
  const deletePlayerById = async (playerId: string) => {
    try {
      await deletePlayer(playerId);
      const playerToDelete = players.find(p => p.id === playerId);
      
      setPlayers(prev => prev.filter(player => player.id !== playerId));
      
      if (playerToDelete) {
        toast({
          title: "Player Removed",
          description: `${playerToDelete.name} has been removed from the swindle.`
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting player:', error);
      return false;
    }
  };
  
  return {
    players,
    addPlayer,
    updatePlayer: updatePlayerById,
    deletePlayer: deletePlayerById
  };
}
