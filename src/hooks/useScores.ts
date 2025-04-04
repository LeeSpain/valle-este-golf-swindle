
import { Score, HoleScore } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useGolfStateContext } from '@/context/GolfStateContext';
import { saveScore as saveScoreApi, verifyScore as verifyScoreApi } from '@/api/scoreService';

export function useScores() {
  const { scores, setScores } = useGolfStateContext();
  
  // Updated to accept a complete Score object instead of individual parameters
  const saveScore = async (score: Score): Promise<Score | null> => {
    try {
      const savedScore = await saveScoreApi(score);
      
      // Update local state
      setScores(prev => {
        const exists = prev.find(s => s.id === savedScore.id);
        if (exists) {
          return prev.map(s => s.id === savedScore.id ? savedScore : s);
        } else {
          return [...prev, savedScore];
        }
      });
      
      toast({
        title: "Score Saved",
        description: "The player's score has been recorded."
      });
      
      return savedScore;
    } catch (error) {
      console.error('Error saving score:', error);
      return null;
    }
  };
  
  const verifyScore = async (scoreId: string): Promise<boolean> => {
    try {
      await verifyScoreApi(scoreId);
      
      // Update local state
      setScores(prev => 
        prev.map(score => 
          score.id === scoreId ? { ...score, isVerified: true } : score
        )
      );
      
      toast({
        title: "Score Verified",
        description: "The score has been verified and is now official."
      });
      
      return true;
    } catch (error) {
      console.error('Error verifying score:', error);
      return false;
    }
  };
  
  return {
    scores,
    saveScore,
    verifyScore
  };
}
