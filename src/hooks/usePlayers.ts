
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '@/types';
import { createPlayer } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { useGolfStateContext } from '@/context/GolfStateContext';

export function usePlayers() {
  const { players, setPlayers, games } = useGolfStateContext();

  const addPlayer = (playerData: Partial<Player>) => {
    const newPlayer = createPlayer(playerData);
    setPlayers(prev => [...prev, newPlayer]);
    toast({
      title: "Player Added",
      description: `${newPlayer.name} has been added to the roster.`
    });
    return newPlayer;
  };
  
  const updatePlayer = (playerId: string, data: Partial<Player>) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, ...data, updatedAt: new Date() } 
          : player
      )
    );
    toast({
      title: "Player Updated",
      description: `Player information has been updated.`
    });
  };
  
  const deletePlayer = (playerId: string) => {
    // Check if player is part of any games
    const playerGames = games.filter(game => game.players.includes(playerId));
    
    if (playerGames.length > 0) {
      toast({
        title: "Cannot Delete Player",
        description: "This player is registered for games and cannot be deleted.",
        variant: "destructive"
      });
      return false;
    }
    
    const playerToDelete = players.find(p => p.id === playerId);
    setPlayers(prev => prev.filter(player => player.id !== playerId));
    
    if (playerToDelete) {
      toast({
        title: "Player Deleted",
        description: `${playerToDelete.name} has been removed from the roster.`
      });
    }
    
    return true;
  };

  return {
    players,
    addPlayer,
    updatePlayer,
    deletePlayer
  };
}
