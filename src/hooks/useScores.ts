
import { Score } from '@/types';
import { createOrUpdateScore } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { useGolfStateContext } from '@/context/GolfStateContext';
import { usePlayers } from './usePlayers';

export function useScores() {
  const { scores, setScores, games, setGames, players } = useGolfStateContext();
  const { updatePlayer } = usePlayers();
  
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
    scores,
    saveScore,
    verifyScore
  };
}
