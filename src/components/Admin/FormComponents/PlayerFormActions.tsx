
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PlayerFormActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

const PlayerFormActions: React.FC<PlayerFormActionsProps> = ({
  isEditing,
  isSubmitting,
  onCancel
}) => {
  return (
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
  );
};

export default PlayerFormActions;
