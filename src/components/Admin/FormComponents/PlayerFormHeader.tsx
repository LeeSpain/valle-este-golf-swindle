
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface PlayerFormHeaderProps {
  isEditing: boolean;
}

const PlayerFormHeader: React.FC<PlayerFormHeaderProps> = ({ isEditing }) => {
  return (
    <CardHeader>
      <CardTitle className="text-xl flex items-center">
        <Users className="mr-2 h-6 w-6 text-golf-green" />
        {isEditing ? 'Edit Player' : 'Add New Player'}
      </CardTitle>
    </CardHeader>
  );
};

export default PlayerFormHeader;
