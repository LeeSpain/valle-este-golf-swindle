
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useGolfState } from '@/hooks/useGolfState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Flag, ClipboardList } from 'lucide-react';

const Scores = () => {
  const { games, players, scores, isLoading, verifyScore } = useGolfState();
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  
  // Sort games by date (newest first)
  const sortedGames = [...games]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // If no game is selected, use the latest one
  const selectedGame = selectedGameId 
    ? games.find(g => g.id === selectedGameId)
    : sortedGames.length > 0 ? sortedGames[0] : null;
  
  // Get scores for the selected game
  const gameScores = selectedGame 
    ? scores.filter(score => score.gameId === selectedGame.id)
    : [];
  
  // Format a score for display
  const formatScore = (score: number | undefined) => {
    if (score === undefined) return '-';
    return score;
  };
  
  const handleVerifyScore = (scoreId: string) => {
    verifyScore(scoreId);
  };

  return (
    <Layout isAdmin>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center justify-between">
              <div className="flex items-center">
                <ClipboardList className="mr-2 h-6 w-6 text-golf-green" />
                Score Management
              </div>
              
              <div className="w-64">
                <Select 
                  value={selectedGameId || (selectedGame?.id || '')} 
                  onValueChange={setSelectedGameId}
                  disabled={isLoading || sortedGames.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedGames.map(game => (
                      <SelectItem key={game.id} value={game.id}>
                        {new Date(game.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                        {' - '}
                        {game.courseSide === 'front9' ? 'Front 9' : 'Back 9'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p>Loading scores...</p>
              </div>
            ) : selectedGame ? (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">
                      {new Date(selectedGame.date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedGame.courseSide === 'front9' ? 'Front 9' : 'Back 9'} • {selectedGame.teeTime}
                    </p>
                  </div>
                  
                  <Badge className={`${selectedGame.isVerified ? 'bg-green-500' : (selectedGame.isComplete ? 'bg-amber-500' : 'bg-blue-500')}`}>
                    {selectedGame.isVerified ? 'Verified' : (selectedGame.isComplete ? 'Completed' : 'In Progress')}
                  </Badge>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-center">Handicap</TableHead>
                        <TableHead className="text-center">Total Strokes</TableHead>
                        <TableHead className="text-center">Net Strokes</TableHead>
                        <TableHead className="text-center">Stableford</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedGame.players.map(playerId => {
                        const player = players.find(p => p.id === playerId);
                        const playerScore = gameScores.find(s => s.playerId === playerId);
                        
                        return (
                          <TableRow key={playerId}>
                            <TableCell className="font-medium">{player?.name || 'Unknown Player'}</TableCell>
                            <TableCell className="text-center">{player?.handicap || '-'}</TableCell>
                            <TableCell className="text-center">{formatScore(playerScore?.totalStrokes)}</TableCell>
                            <TableCell className="text-center">{formatScore(playerScore?.totalNetStrokes)}</TableCell>
                            <TableCell className="text-center font-bold">{formatScore(playerScore?.totalStablefordPoints)}</TableCell>
                            <TableCell className="text-center">
                              {!playerScore ? (
                                <Badge variant="outline">Not entered</Badge>
                              ) : playerScore.isVerified ? (
                                <Badge className="bg-green-500">Verified</Badge>
                              ) : (
                                <Badge className="bg-amber-500">Pending</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {playerScore && !playerScore.isVerified && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-golf-green text-golf-green hover:bg-golf-green hover:text-white"
                                  onClick={() => handleVerifyScore(playerScore.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Verify
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      
                      {selectedGame.players.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                            No players assigned to this game
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No games available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Scores;
