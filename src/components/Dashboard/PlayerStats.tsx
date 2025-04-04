
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Score, Player } from '@/types';

interface PlayerStatsProps {
  player: Player | null;
  scores: Score[];
  isLoading: boolean;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player, scores, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Your Stats</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <p>Loading your stats...</p>
        </CardContent>
      </Card>
    );
  }

  if (!player) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Your Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to view your stats</p>
        </CardContent>
      </Card>
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Your Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
      </CardContent>
    </Card>
  );
};

export default PlayerStats;
