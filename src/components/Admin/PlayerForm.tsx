
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Player } from '@/types';
import PlayerFormHeader from './FormComponents/PlayerFormHeader';
import PlayerContactFields from './FormComponents/PlayerContactFields';
import PlayerDetailsFields from './FormComponents/PlayerDetailsFields';
import PlayerFormActions from './FormComponents/PlayerFormActions';

interface PlayerFormProps {
  player: Partial<Player>;
  isEditing: boolean;
  isSubmitting?: boolean;
  onSubmit: (player: Partial<Player>) => void;
  onCancel: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ 
  player, 
  isEditing, 
  isSubmitting = false,
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Partial<Player>>(player);
  
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
    
    if (!isSubmitting) {
      onSubmit(formData);
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
      <PlayerFormHeader isEditing={isEditing} />
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <PlayerContactFields 
            name={formData.name || ''}
            email={formData.email || ''}
            phone={formData.phone || ''}
            facebookLink={formData.facebookLink || ''}
            onChange={handleChange}
            isSubmitting={isSubmitting}
          />
          
          <PlayerDetailsFields 
            gender={formData.gender}
            preferredTee={formData.preferredTee}
            handicap={formData.handicap}
            onSelectChange={handleSelectChange}
            onHandicapChange={handleHandicapChange}
            isSubmitting={isSubmitting}
          />
        </CardContent>
        
        <PlayerFormActions 
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </form>
    </Card>
  );
};

export default PlayerForm;
