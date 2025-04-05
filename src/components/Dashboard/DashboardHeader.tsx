
import React from 'react';

const DashboardHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-golf-green to-golf-green-light">
          Welcome to Karen's Bar Golf Swindle
        </h1>
        <p className="text-muted-foreground mt-1">
          Track scores, view leaderboards, and stay connected with your golfing community
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
