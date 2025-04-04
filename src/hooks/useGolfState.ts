
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Player, Game, Score, WeatherData } from '@/types';
import { mockPlayers, mockGames, mockScores, mockWeather, createPlayer, createGame, createOrUpdateScore } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

export function useGolfState() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPlayers(mockPlayers);
      setGames(mockGames);
      setScores(mockScores);
      setWeather(mockWeather);
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
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
  
  // Player operations
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
  
  // Game operations
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
  
  // Score operations
  const saveScore = (scoreData: Partial<Score>) => {
    const newOrUpdatedScore = createOrUpdateScore(scoreData);
    
    if (scoreData.id) {
      // Update existing score
      setScores(prev => 
        prev.map(score => 
          score.id === scoreData.id 
            ? newOrUpdatedScore
            : score
        )
      );
      toast({
        title: "Score Updated",
        description: `Score has been updated successfully.`
      });
    } else {
      // Add new score
      setScores(prev => [...prev, newOrUpdatedScore]);
      toast({
        title: "Score Saved",
        description: `Score has been recorded successfully.`
      });
    }
    
    return newOrUpdatedScore;
  };
  
  const verifyScore = (scoreId: string) => {
    // Mark score as verified
    setScores(prev => 
      prev.map(score => 
        score.id === scoreId 
          ? { ...score, isVerified: true, updatedAt: new Date() } 
          : score
      )
    );
    
    // Find score and relevant game
    const verifiedScore = scores.find(s => s.id === scoreId);
    
    if (verifiedScore) {
      const scoreGame = games.find(g => g.id === verifiedScore.gameId);
      
      // Update game completion status if all player scores are verified
      if (scoreGame) {
        const gameScores = scores.filter(s => s.gameId === scoreGame.id);
        const allPlayersScored = scoreGame.players.every(
          playerId => gameScores.some(s => s.playerId === playerId)
        );
        
        if (allPlayersScored) {
          const allVerified = gameScores.every(s => s.isVerified);
          
          if (allVerified) {
            // Mark game as complete and verified
            setGames(prev => 
              prev.map(game => 
                game.id === scoreGame.id 
                  ? { ...game, isComplete: true, isVerified: true, updatedAt: new Date() } 
                  : game
              )
            );
          }
        }
      }
      
      // Update player handicap based on score
      updatePlayerHandicap(verifiedScore.playerId);
      
      toast({
        title: "Score Verified",
        description: `Score has been verified and handicap updated.`
      });
    }
  };
  
  // Handicap adjustment
  const updatePlayerHandicap = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    // Get the player's scores in chronological order
    const playerScores = scores
      .filter(s => s.playerId === playerId && s.isVerified)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    if (playerScores.length === 0) return;
    
    // Very simple handicap adjustment algorithm (for demonstration)
    // In reality, this would be more complex and would follow official handicap rules
    const latestScore = playerScores[playerScores.length - 1];
    
    // Get average of last 3 scores or all if less than 3
    const recentScores = playerScores.slice(-3);
    const avgStablefordPoints = recentScores.reduce((sum, score) => sum + score.totalStablefordPoints, 0) / recentScores.length;
    
    // Simple adjustment algorithm:
    // - If average points > 18: reduce handicap (playing better than handicap)
    // - If average points < 16: increase handicap (playing worse than handicap)
    // - Amount of adjustment depends on how far from 17 (target) points
    let newHandicap = player.handicap;
    
    if (avgStablefordPoints > 18) {
      // Reduce handicap (playing better than handicap)
      const reduction = Math.min(2, Math.max(0.1, (avgStablefordPoints - 18) * 0.2));
      newHandicap = Math.max(0, player.handicap - reduction);
    } else if (avgStablefordPoints < 16) {
      // Increase handicap (playing worse than handicap)
      const increase = Math.min(1, Math.max(0.1, (16 - avgStablefordPoints) * 0.1));
      newHandicap = Math.min(54, player.handicap + increase);
    }
    
    // Round to 1 decimal place
    newHandicap = Math.round(newHandicap * 10) / 10;
    
    if (newHandicap !== player.handicap) {
      updatePlayer(playerId, { handicap: newHandicap });
    }
  };
  
  return {
    players,
    games,
    scores,
    weather,
    isLoading,
    getNextGame,
    getLatestCompletedGame,
    addPlayer,
    updatePlayer,
    deletePlayer,
    addGame,
    updateGame,
    deleteGame,
    saveScore,
    verifyScore
  };
}
