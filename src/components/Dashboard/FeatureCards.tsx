
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flag, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-100">
        <CardHeader className="bg-gradient-to-r from-golf-green-light/10 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-golf-green" />
            <span>Manage Your Scores</span>
          </CardTitle>
          <CardDescription>
            Track your performance and see your progress over time
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <p className="text-sm">
            Enter your scores after each round and track your handicap changes
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-shadow border-gray-100">
        <CardHeader className="bg-gradient-to-r from-golf-green-light/10 to-transparent">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-golf-green" />
            <span>Photo Gallery</span>
          </CardTitle>
          <CardDescription>
            Share your best moments on the course
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <p className="text-sm">
            Upload photos from games and browse images shared by others
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline">
            <Link to="/photos">
              View Gallery
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeatureCards;
