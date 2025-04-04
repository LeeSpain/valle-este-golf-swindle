
import React from 'react';
import { Score, Player } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, User } from 'lucide-react';

interface PlayerStatsProps {
  player: Player | null;
  scores: Score[];
  isLoading: boolean;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player, scores, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-md" />
          <Skeleton className="h-24 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-md" />
          <Skeleton className="h-24 rounded-md" />
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="py-8 text-center">
        <User className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">No player selected</h3>
        <p className="text-gray-400">Please log in to view your stats</p>
      </div>
    );
  }

  // Calculate stats
  const playerScores = scores.filter(score => score.playerId === player.id);
  const latestScore = playerScores.length > 0 ? 
    playerScores.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] : 
    null;
  
  const averageStablefordPoints = playerScores.length > 0 ? 
    Math.round(playerScores.reduce((sum, score) => sum + score.totalStablefordPoints, 0) / playerScores.length) : 
    0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Trophy className="h-5 w-5 text-golf-green" />
        <span>{player.name}'s Stats</span>
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-3 rounded-md">
          <p className="text-sm text-gray-600">Current Handicap</p>
          <p className="text-2xl font-bold">{player.handicap}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-md">
          <p className="text-sm text-gray-600">Games Played</p>
          <p className="text-2xl font-bold">{playerScores.length}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-3 rounded-md">
          <p className="text-sm text-gray-600">Avg. Stableford</p>
          <p className="text-2xl font-bold">{averageStablefordPoints}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-md">
          <p className="text-sm text-gray-600">Last Score</p>
          <p className="text-2xl font-bold">{latestScore ? latestScore.totalStablefordPoints : '-'}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
