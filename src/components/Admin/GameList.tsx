
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Game, Player } from '@/types';
import { Calendar, Pencil, Trash2, ClipboardList, CheckCircle, Users } from 'lucide-react';

interface GameListProps {
  games: Game[];
  players: Player[];
  onEdit: (game: Game) => void;
  onDelete: (gameId: string) => void;
  onAddNew: () => void;
  onManageScores: (game: Game) => void;
  onCheckIn: (game: Game) => void;
  onCompleteGame: (game: Game) => void;
  isLoading: boolean;
}

const GameList: React.FC<GameListProps> = ({
  games,
  players,
  onEdit,
  onDelete,
  onAddNew,
  onManageScores,
  onCheckIn,
  onCompleteGame,
  isLoading
}) => {
  // Sort games by date, newest first
  const sortedGames = [...games].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Format a date for display
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Get player names as a comma-separated string
  const getPlayerNames = (playerIds: string[]) => {
    const gamePlayerNames = playerIds.map(id => {
      const player = players.find(p => p.id === id);
      return player ? player.name : 'Unknown Player';
    });
    
    if (gamePlayerNames.length === 0) return 'No players assigned';
    
    if (gamePlayerNames.length <= 2) {
      return gamePlayerNames.join(', ');
    }
    
    return `${gamePlayerNames.slice(0, 2).join(', ')} +${gamePlayerNames.length - 2} more`;
  };
  
  // Get checked-in player count
  const getCheckedInCount = (game: Game) => {
    if (!game.playerStatus) return '0';
    
    const checkedInCount = game.playerStatus.filter(status => status.checkedIn).length;
    return `${checkedInCount}/${game.players.length}`;
  };
  
  // Check if all players have scores
  const getAllScoresEntered = (game: Game) => {
    // This would need to get scores from props or context
    // For now, just using the isComplete flag
    return game.isComplete;
  };
  
  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Determine if a game is in the past
  const isGameInPast = (gameDate: Date | string) => {
    const date = new Date(gameDate);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div>
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Upcoming Games</h2>
        <Button onClick={onAddNew} className="bg-golf-green hover:bg-golf-green-dark">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule New Game
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading games...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Tee Time</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Players</TableHead>
                <TableHead className="text-center">Check-Ins</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedGames.length > 0 ? (
                sortedGames.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>
                      <div className="font-medium">{formatDate(game.date)}</div>
                      <div className="text-sm text-gray-500">{game.teeTime}</div>
                    </TableCell>
                    <TableCell>
                      {game.courseSide === 'front9' ? 'Front 9' : 'Back 9'}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{getPlayerNames(game.players)}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono">
                        {getCheckedInCount(game)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {game.isVerified ? (
                        <Badge className="bg-golf-green">Verified</Badge>
                      ) : game.isComplete ? (
                        <Badge className="bg-amber-500">Completed</Badge>
                      ) : isGameInPast(game.date) ? (
                        <Badge variant="outline" className="border-red-500 text-red-500">Needs Scores</Badge>
                      ) : (
                        <Badge className="bg-blue-500">Scheduled</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {!isGameInPast(game.date) && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => onCheckIn(game)}
                            className="border-golf-green text-golf-green hover:bg-golf-green-light/10">
                            <Users className="h-4 w-4 mr-1" />
                            Check-In
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => onEdit(game)}
                            className="border-blue-500 text-blue-500 hover:bg-blue-500/10 mr-1">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {isGameInPast(game.date) && (
                        <Button variant="outline" size="sm" onClick={() => onManageScores(game)}
                          className="border-amber-500 text-amber-500 hover:bg-amber-500/10 mr-1">
                          <ClipboardList className="h-4 w-4 mr-1" />
                          Scores
                        </Button>
                      )}
                      
                      {isGameInPast(game.date) && !game.isComplete && (
                        <Button variant="outline" size="sm" onClick={() => onCompleteGame(game)}
                          className="border-golf-green text-golf-green hover:bg-golf-green-light/10 mr-1">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm" onClick={() => onDelete(game.id)}
                        className="border-red-500 text-red-500 hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No games scheduled. Click "Schedule New Game" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default GameList;
