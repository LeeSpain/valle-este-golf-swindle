
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Game, Player } from '@/types';
import { Calendar, PlusCircle, ClipboardList, Edit, Trash } from 'lucide-react';

interface GameListProps {
  games: Game[];
  players: Player[];
  onEdit: (game: Game) => void;
  onDelete: (gameId: string) => void;
  onAddNew: () => void;
  onManageScores: (game: Game) => void;
  isLoading: boolean;
}

const GameList: React.FC<GameListProps> = ({ 
  games, 
  players,
  onEdit, 
  onDelete, 
  onAddNew,
  onManageScores,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Calendar className="mr-2 h-6 w-6 text-golf-green" />
            Game Management
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p>Loading games...</p>
        </CardContent>
      </Card>
    );
  }

  // Sort games by date (descending - newest first)
  const sortedGames = [...games].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="mr-2 h-6 w-6 text-golf-green" />
            Game Management
          </div>
          <Button onClick={onAddNew} className="bg-golf-green hover:bg-golf-green-dark">
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule Game
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Tee Time</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedGames.length > 0 ? (
                sortedGames.map((game) => {
                  const gameDate = new Date(game.date);
                  const isUpcoming = gameDate >= new Date();
                  const playerCount = game.players.length;
                  
                  return (
                    <TableRow key={game.id}>
                      <TableCell className="font-medium">
                        {gameDate.toLocaleDateString('en-GB', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>{game.teeTime}</TableCell>
                      <TableCell>
                        {game.courseSide === 'front9' ? 'Front 9' : 'Back 9'}
                      </TableCell>
                      <TableCell>
                        {playerCount} player{playerCount !== 1 ? 's' : ''}
                      </TableCell>
                      <TableCell>
                        {isUpcoming ? (
                          <Badge className="bg-golf-green">Upcoming</Badge>
                        ) : game.isVerified ? (
                          <Badge className="bg-blue-500">Verified</Badge>
                        ) : game.isComplete ? (
                          <Badge className="bg-amber-500">Completed</Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onManageScores(game)}
                          >
                            <ClipboardList className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onEdit(game)}
                            disabled={game.isVerified}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onDelete(game.id)}
                            disabled={game.isVerified}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No games scheduled yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameList;
