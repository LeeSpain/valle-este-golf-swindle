
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Player } from '@/types';
import { Users, PlusCircle, Search, Edit, Trash } from 'lucide-react';

interface PlayerListProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (playerId: string) => void;
  onAddNew: () => void;
  isLoading: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ 
  players, 
  onEdit, 
  onDelete, 
  onAddNew,
  isLoading 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    player.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Users className="mr-2 h-6 w-6 text-golf-green" />
            Player Management
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p>Loading players...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 h-6 w-6 text-golf-green" />
            Player Management
          </div>
          <Button onClick={onAddNew} className="bg-golf-green hover:bg-golf-green-dark">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Player
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search players..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Gender</TableHead>
                <TableHead className="text-center">Tee</TableHead>
                <TableHead className="text-center">Handicap</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>{player.email}</TableCell>
                    <TableCell className="text-center capitalize">{player.gender}</TableCell>
                    <TableCell className="text-center capitalize">{player.preferredTee}</TableCell>
                    <TableCell className="text-center">{player.handicap}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onEdit(player)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDelete(player.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    {searchTerm ? 'No players found matching your search' : 'No players added yet'}
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

export default PlayerList;
