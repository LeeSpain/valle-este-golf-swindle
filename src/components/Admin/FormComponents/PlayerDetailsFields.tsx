
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gender, TeeColor } from '@/types';

interface PlayerDetailsFieldsProps {
  gender: Gender | undefined;
  preferredTee: TeeColor | undefined;
  handicap: number | undefined;
  onSelectChange: (name: string, value: string) => void;
  onHandicapChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

const PlayerDetailsFields: React.FC<PlayerDetailsFieldsProps> = ({
  gender,
  preferredTee,
  handicap,
  onSelectChange,
  onHandicapChange,
  isSubmitting
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select 
            value={gender as Gender} 
            onValueChange={(value) => onSelectChange('gender', value as Gender)}
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
            value={preferredTee as TeeColor} 
            onValueChange={(value) => onSelectChange('preferredTee', value as TeeColor)}
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
          value={handicap !== undefined ? handicap : ''}
          onChange={onHandicapChange}
          required
          disabled={isSubmitting}
        />
      </div>
    </>
  );
};

export default PlayerDetailsFields;
