
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Game, Player, CourseSide } from '@/types';
import { Calendar } from 'lucide-react';

interface GameFormProps {
  game: Partial<Game>;
  players: Player[];
  isEditing: boolean;
  onSubmit: (game: Partial<Game>) => void;
  onCancel: () => void;
}

// Define a new interface that has date as string for the form state
interface GameFormState extends Omit<Partial<Game>, 'date'> {
  date: string;
}

const GameForm: React.FC<GameFormProps> = ({ 
  game, 
  players, 
  isEditing, 
  onSubmit, 
  onCancel 
}) => {
  // Convert Date objects to string format for form inputs
  const formatDateToString = (date: Date | string | undefined): string => {
    if (!date) return new Date().toISOString().split('T')[0];
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState<GameFormState>({
    ...game,
    // Store date as a string for the input field
    date: formatDateToString(game.date),
    players: game.players || [],
  });
  
  // Initialize with the next Sunday if adding a new game
  useEffect(() => {
    if (!isEditing && !game.date) {
      const today = new Date();
      const nextSunday = new Date(today);
      nextSunday.setDate(today.getDate() + (7 - today.getDay()) % 7);
      setFormData(prev => ({
        ...prev,
        date: nextSunday.toISOString().split('T')[0],
      }));
    }
  }, [isEditing, game.date]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePlayerToggle = (playerId: string) => {
    setFormData(prev => {
      const currentPlayers = prev.players || [];
      if (currentPlayers.includes(playerId)) {
        return { ...prev, players: currentPlayers.filter(id => id !== playerId) };
      } else {
        return { ...prev, players: [...currentPlayers, playerId] };
      }
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert date string back to Date object for the Game type
    const processedData: Partial<Game> = {
      ...formData,
      date: new Date(formData.date),
    };
    
    onSubmit(processedData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Calendar className="mr-2 h-6 w-6 text-golf-green" />
          {isEditing ? 'Edit Game' : 'Schedule New Game'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Game Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teeTime">Tee Time</Label>
              <Input
                id="teeTime"
                name="teeTime"
                type="time"
                value={formData.teeTime || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="courseSide">Course Side</Label>
            <Select 
              value={formData.courseSide as string || 'front9'} 
              onValueChange={(value) => handleSelectChange('courseSide', value as CourseSide)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course side" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="front9">Front 9 (Holes 1-9)</SelectItem>
                <SelectItem value="back9">Back 9 (Holes 10-18)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Additional information, meeting point, etc."
              value={formData.notes || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-3">
            <Label>Select Players</Label>
            <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
              {players.length > 0 ? (
                <div className="space-y-2">
                  {players.map((player) => (
                    <div key={player.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`player-${player.id}`}
                        checked={(formData.players || []).includes(player.id)}
                        onCheckedChange={() => handlePlayerToggle(player.id)}
                      />
                      <Label 
                        htmlFor={`player-${player.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        {player.name}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-2">No players available</p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {(formData.players || []).length} player{(formData.players || []).length !== 1 ? 's' : ''} selected
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-golf-green hover:bg-golf-green-dark">
            {isEditing ? 'Update Game' : 'Schedule Game'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default GameForm;
