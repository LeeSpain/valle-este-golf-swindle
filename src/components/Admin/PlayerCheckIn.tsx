
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Game, Player, PlayerGameStatus } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PlayerCheckInProps {
  game: Game;
  players: Player[];
  availablePlayers: Player[];
  onUpdateGamePlayers: (updatedGame: Partial<Game>) => void;
  onCancel: () => void;
}

const PlayerCheckIn: React.FC<PlayerCheckInProps> = ({
  game,
  players,
  availablePlayers,
  onUpdateGamePlayers,
  onCancel
}) => {
  const [playerStatus, setPlayerStatus] = useState<PlayerGameStatus[]>(
    game.playerStatus || 
    game.players.map(playerId => ({
      playerId,
      checkedIn: false,
      hasPaid: false
    }))
  );
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  
  // Filter game players based on search term
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter available players that aren't already in the game
  const filteredAvailablePlayers = availablePlayers.filter(player => 
    !game.players.includes(player.id) && 
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckInToggle = (playerId: string) => {
    setPlayerStatus(prev => 
      prev.map(status => 
        status.playerId === playerId 
          ? { ...status, checkedIn: !status.checkedIn } 
          : status
      )
    );
  };

  const handlePaymentToggle = (playerId: string) => {
    setPlayerStatus(prev => 
      prev.map(status => 
        status.playerId === playerId 
          ? { ...status, hasPaid: !status.hasPaid } 
          : status
      )
    );
  };
  
  const handleAddPlayer = () => {
    if (!selectedPlayerId) return;
    
    // Add player to game
    const updatedPlayers = [...game.players, selectedPlayerId];
    
    // Add player status
    const updatedPlayerStatus = [
      ...playerStatus,
      {
        playerId: selectedPlayerId,
        checkedIn: true, // Auto check-in the player since they're being added on the spot
        hasPaid: false
      }
    ];
    
    setPlayerStatus(updatedPlayerStatus);
    onUpdateGamePlayers({
      ...game,
      players: updatedPlayers,
      playerStatus: updatedPlayerStatus
    });
    
    // Reset selection
    setSelectedPlayerId('');
  };
  
  const handleSave = () => {
    onUpdateGamePlayers({
      ...game,
      playerStatus: playerStatus
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Player Check-In</CardTitle>
        <p className="text-muted-foreground text-sm">
          {new Date(game.date).toLocaleDateString()} | {game.teeTime} | {game.courseSide === 'front9' ? 'Front 9' : 'Back 9'}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search players..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead className="w-[120px] text-center">Checked In</TableHead>
                <TableHead className="w-[120px] text-center">Paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map(player => {
                  const status = playerStatus.find(s => s.playerId === player.id) || {
                    playerId: player.id,
                    checkedIn: false,
                    hasPaid: false
                  };
                  
                  return (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Checkbox 
                            checked={status.checkedIn}
                            onCheckedChange={() => handleCheckInToggle(player.id)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Checkbox 
                            checked={status.hasPaid}
                            onCheckedChange={() => handlePaymentToggle(player.id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                    No players found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="bg-muted p-4 rounded-md space-y-4">
          <h3 className="font-medium">Add Walk-In Player</h3>
          <div className="flex items-center gap-2">
            <Select
              value={selectedPlayerId}
              onValueChange={setSelectedPlayerId}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a player" />
              </SelectTrigger>
              <SelectContent>
                {filteredAvailablePlayers.map(player => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              onClick={handleAddPlayer}
              disabled={!selectedPlayerId}
              className="whitespace-nowrap bg-golf-green hover:bg-golf-green-dark"
            >
              Add to Game
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            If a player is not in the list, add them to the player roster first.
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={handleSave}
          className="bg-golf-green hover:bg-golf-green-dark"
        >
          Save Check-In Status
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlayerCheckIn;
