
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PlayerContactFieldsProps {
  name: string;
  email: string;
  phone: string;
  facebookLink: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

const PlayerContactFields: React.FC<PlayerContactFieldsProps> = ({
  name,
  email,
  phone,
  facebookLink,
  onChange,
  isSubmitting
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={name || ''}
          onChange={onChange}
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
          value={email || ''}
          onChange={onChange}
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input
          id="phone"
          name="phone"
          value={phone || ''}
          onChange={onChange}
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="facebookLink">Facebook Link (Optional)</Label>
        <Input
          id="facebookLink"
          name="facebookLink"
          value={facebookLink || ''}
          onChange={onChange}
          placeholder="https://facebook.com/username"
          disabled={isSubmitting}
        />
      </div>
    </>
  );
};

export default PlayerContactFields;
