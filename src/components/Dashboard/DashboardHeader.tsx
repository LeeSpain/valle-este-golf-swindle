
import React, { useState, useEffect } from 'react';

const DashboardHeader: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(true);
  
  useEffect(() => {
    console.log("DashboardHeader mounted");
    return () => {
      console.log("DashboardHeader unmounted");
    };
  }, []);
  
  console.log("DashboardHeader rendering");
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-golf-green to-golf-green-light">
          Welcome to Karen's Bar Golf Swindle
        </h1>
        <p className="text-muted-foreground mt-1">
          Track scores, view leaderboards, and stay connected with your golfing community
        </p>
      </div>
      <div className="hidden md:block">
        {imageLoaded && (
          <img 
            src="/lovable-uploads/bc6a11b3-f4bd-40f7-8f2c-1fb52daa729c.png" 
            alt="Golf Logo" 
            className="h-16 w-auto"
            onError={(e) => {
              console.error("Image failed to load");
              setImageLoaded(false);
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
