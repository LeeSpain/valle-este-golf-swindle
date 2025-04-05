
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar } from 'lucide-react';

// Custom GolfBall icon since it's not in lucide-react
const GolfBall = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
};

interface StatsCardsProps {
  players: number;
  games: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ players, games }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Users className="mr-2 h-4 w-4 text-golf-green" />
            Players
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{players}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Active members in the group
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-golf-green" />
            Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{games}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total games scheduled
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <GolfBall className="mr-2 h-4 w-4 text-golf-green" />
            Course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">Valle del Este</div>
          <p className="text-xs text-muted-foreground mt-1">
            Home course for our events
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
