
import React from 'react';

const DashboardHeader: React.FC = () => {
  console.log("DashboardHeader rendering");
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-golf-green">
          Karen's Bar Golf Swindle
        </h1>
        <p className="text-muted-foreground mt-1">
          Track scores, view leaderboards, and stay connected with your golfing community
        </p>
      </div>
      {/* Removed the logo image */}
    </div>
  );
};

export default React.memo(DashboardHeader);
