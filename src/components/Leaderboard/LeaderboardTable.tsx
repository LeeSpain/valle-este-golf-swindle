
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { Player, Score, Game } from '@/types';

interface LeaderboardTableProps {
  scores: Score[];
  players: Player[];
  game: Game | null;
  isLoading: boolean;
  renderPlayerCell?: (player: Player) => React.ReactNode;
}

interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  handicap: number;
  stablefordPoints: number;
  rank: number;
  isKarensPick?: boolean;
  isImproved?: boolean;
  isBandit?: boolean;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  scores, 
  players, 
  game, 
  isLoading,
  renderPlayerCell 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p>Loading leaderboard...</p>
        </CardContent>
      </Card>
    );
  }

  if (!game || scores.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No data available for the leaderboard</p>
        </CardContent>
      </Card>
    );
  }

  // Create leaderboard entries
  const leaderboardEntries: LeaderboardEntry[] = scores
    .filter(score => score.gameId === game.id && score.isVerified)
    .map(score => {
      const player = players.find(p => p.id === score.playerId);
      return {
        playerId: score.playerId,
        playerName: player ? player.name : 'Unknown Player',
        handicap: player ? player.handicap : 0,
        stablefordPoints: score.totalStablefordPoints,
        rank: 0, // Will be calculated below
        isKarensPick: false, // Placeholder for demo
        isImproved: false, // Placeholder for demo
        isBandit: false, // Placeholder for demo
      };
    });

  // Sort by stableford points (descending)
  leaderboardEntries.sort((a, b) => b.stablefordPoints - a.stablefordPoints);

  // Assign ranks
  leaderboardEntries.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  // For demo purposes, let's assign some special statuses
  if (leaderboardEntries.length > 0) {
    leaderboardEntries[0].isKarensPick = true;
    
    if (leaderboardEntries.length > 1) {
      leaderboardEntries[1].isImproved = true;
    }
    
    if (leaderboardEntries.length > 2) {
      leaderboardEntries[2].isBandit = true;
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Award className="mr-2 h-6 w-6 text-golf-green" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-center">Handicap</TableHead>
              <TableHead className="text-center">Points</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardEntries.map((entry) => {
              const player = players.find(p => p.id === entry.playerId);
              
              return (
                <TableRow key={entry.playerId}>
                  <TableCell className="font-medium">
                    {entry.rank === 1 ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-golf-green text-white rounded-full">
                        1
                      </span>
                    ) : (
                      entry.rank
                    )}
                  </TableCell>
                  <TableCell>
                    {player && renderPlayerCell 
                      ? renderPlayerCell(player) 
                      : entry.playerName}
                  </TableCell>
                  <TableCell className="text-center">{entry.handicap}</TableCell>
                  <TableCell className="text-center font-bold">{entry.stablefordPoints}</TableCell>
                  <TableCell className="text-right">
                    {entry.isKarensPick && (
                      <span className="bg-rustic-brown text-white text-xs px-2 py-1 rounded-full ml-1">
                        Karen's Pick
                      </span>
                    )}
                    {entry.isImproved && (
                      <span className="bg-golf-green text-white text-xs px-2 py-1 rounded-full ml-1">
                        Most Improved
                      </span>
                    )}
                    {entry.isBandit && (
                      <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full ml-1">
                        Bandit
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
