
import { Score, HoleScore } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useGolfStateContext } from '@/context/GolfStateContext';
import { useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NotificationsContext } from '@/context/NotificationsContext';

export function useScores() {
  const { scores, setScores, players } = useGolfStateContext();
  const notifications = useContext(NotificationsContext);
  
  const saveScore = (
    gameId: string, 
    playerId: string, 
    holeScores: HoleScore[], 
    totalStrokes: number,
    totalNetStrokes: number,
    totalStablefordPoints: number
  ) => {
    const existingScoreIndex = scores.findIndex(
      score => score.gameId === gameId && score.playerId === playerId
    );
    
    if (existingScoreIndex >= 0) {
      // Update existing score
      const updatedScores = [...scores];
      updatedScores[existingScoreIndex] = {
        ...updatedScores[existingScoreIndex],
        holes: holeScores,
        totalStrokes,
        totalNetStrokes,
        totalStablefordPoints,
        updatedAt: new Date(),
      };
      
      setScores(updatedScores);
      toast({
        title: "Score Updated",
        description: "Player's score has been updated successfully."
      });
    } else {
      // Create new score
      const newScore: Score = {
        id: uuidv4(),
        gameId,
        playerId,
        holes: holeScores,
        totalStrokes,
        totalNetStrokes,
        totalStablefordPoints,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setScores(prev => [...prev, newScore]);
      toast({
        title: "Score Saved",
        description: "Player's score has been recorded successfully."
      });
      
      // Notify about the new score
      if (notifications) {
        const player = players.find(p => p.id === playerId);
        if (player) {
          notifications.notifyNewScore(player.name, totalStablefordPoints);
        }
      }
    }
  };
  
  const verifyScore = (scoreId: string) => {
    const scoreIndex = scores.findIndex(score => score.id === scoreId);
    
    if (scoreIndex >= 0) {
      const updatedScores = [...scores];
      updatedScores[scoreIndex] = {
        ...updatedScores[scoreIndex],
        isVerified: true,
        updatedAt: new Date(),
      };
      
      setScores(updatedScores);
      toast({
        title: "Score Verified",
        description: "The score has been verified and added to the leaderboard."
      });
      
      // Notify about the verified score
      if (notifications) {
        const score = updatedScores[scoreIndex];
        const player = players.find(p => p.id === score.playerId);
        if (player) {
          notifications.notifyScoreVerified(player.name, score.totalStablefordPoints);
        }
      }
    }
  };
  
  return {
    scores,
    saveScore,
    verifyScore
  };
}
