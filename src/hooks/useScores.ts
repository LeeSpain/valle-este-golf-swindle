
import { Score } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useGolfStateContext } from '@/context/GolfStateContext';
import { createScore, updateScore, verifyScore as apiVerifyScore } from '@/api/scoreService';

export function useScores() {
  const { scores, setScores } = useGolfStateContext();
  
  const saveScore = async (scoreData: Partial<Score>) => {
    try {
      let updatedScore;
      
      if (scoreData.id) {
        // Update existing score
        updatedScore = await updateScore(scoreData.id, scoreData);
        setScores(prev => 
          prev.map(score => 
            score.id === scoreData.id ? updatedScore : score
          )
        );
      } else {
        // Create new score
        updatedScore = await createScore(scoreData as Omit<Score, 'id' | 'createdAt' | 'updatedAt' | 'isVerified'>);
        setScores(prev => [...prev, updatedScore]);
      }
      
      toast({
        title: "Score Saved",
        description: "Your score has been successfully recorded."
      });
      
      return updatedScore;
    } catch (error) {
      console.error('Error saving score:', error);
      return null;
    }
  };
  
  const verifyScore = async (scoreId: string) => {
    try {
      const updatedScore = await apiVerifyScore(scoreId);
      
      setScores(prev => 
        prev.map(score => 
          score.id === scoreId ? updatedScore : score
        )
      );
      
      toast({
        title: "Score Verified",
        description: "This score has been verified and locked."
      });
      
      return updatedScore;
    } catch (error) {
      console.error('Error verifying score:', error);
      return null;
    }
  };
  
  return {
    scores,
    saveScore,
    verifyScore
  };
}
