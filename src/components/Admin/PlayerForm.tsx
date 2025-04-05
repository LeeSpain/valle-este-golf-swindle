
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Player, Gender, TeeColor } from '@/types';
import { Users } from 'lucide-react';

interface PlayerFormProps {
  player: Partial<Player>;
  isEditing: boolean;
  onSubmit: (player: Partial<Player>) => void;
  onCancel: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ 
  player, 
  isEditing, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Partial<Player>>(player);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // When player prop changes, update formData
  useEffect(() => {
    setFormData(player);
  }, [player]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleHandicapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setFormData(prev => ({ ...prev, handicap: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };
  
  // Auto-select tee color based on gender
  useEffect(() => {
    if (formData.gender === 'male' && !formData.preferredTee) {
      setFormData(prev => ({ ...prev, preferredTee: 'yellow' }));
    } else if (formData.gender === 'female' && !formData.preferredTee) {
      setFormData(prev => ({ ...prev, preferredTee: 'red' }));
    }
  }, [formData.gender]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Users className="mr-2 h-6 w-6 text-golf-green" />
          {isEditing ? 'Edit Player' : 'Add New Player'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="facebookLink">Facebook Link (Optional)</Label>
            <Input
              id="facebookLink"
              name="facebookLink"
              value={formData.facebookLink || ''}
              onChange={handleChange}
              placeholder="https://facebook.com/username"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={formData.gender as Gender} 
                onValueChange={(value) => handleSelectChange('gender', value as Gender)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferredTee">Preferred Tee</Label>
              <Select 
                value={formData.preferredTee as TeeColor} 
                onValueChange={(value) => handleSelectChange('preferredTee', value as TeeColor)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yellow">Yellow (Men)</SelectItem>
                  <SelectItem value="red">Red (Ladies)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="handicap">Handicap</Label>
            <Input
              id="handicap"
              name="handicap"
              type="number"
              min="0"
              max="54"
              step="0.1"
              value={formData.handicap !== undefined ? formData.handicap : ''}
              onChange={handleHandicapChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-golf-green hover:bg-golf-green-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Player' : 'Add Player')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PlayerForm;
