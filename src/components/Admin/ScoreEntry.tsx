
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Game, Player, Score, CourseData } from '@/types';
import { ClipboardList, Check, Flag } from 'lucide-react';

interface ScoreEntryProps {
  game: Game;
  players: Player[];
  scores: Score[];
  courseData: CourseData;
  onSaveScore: (score: Partial<Score>) => void;
  onVerifyScore: (scoreId: string) => void;
  onCancel: () => void;
}

const ScoreEntry: React.FC<ScoreEntryProps> = ({ 
  game, 
  players, 
  scores,
  courseData,
  onSaveScore, 
  onVerifyScore,
  onCancel 
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [holeScores, setHoleScores] = useState<{ [key: number]: number }>({});
  const [calculatedScore, setCalculatedScore] = useState<{
    totalStrokes: number;
    totalNetStrokes: number;
    totalStablefordPoints: number;
    stablefordByHole: { [key: number]: number };
  }>({
    totalStrokes: 0,
    totalNetStrokes: 0,
    totalStablefordPoints: 0,
    stablefordByHole: {},
  });
  
  // Get the holes for the selected course side
  const holes = game.courseSide === 'front9' ? courseData.front9 : courseData.back9;
  
  // Find the existing score for the selected player
  const existingScore = selectedPlayerId ? 
    scores.find(s => s.gameId === game.id && s.playerId === selectedPlayerId) :
    null;
  
  // When player changes, load their existing score if available
  useEffect(() => {
    if (selectedPlayerId && existingScore) {
      const scoresByHole: { [key: number]: number } = {};
      existingScore.holes.forEach(hole => {
        scoresByHole[hole.holeNumber] = hole.strokes;
      });
      setHoleScores(scoresByHole);
    } else {
      setHoleScores({});
    }
  }, [selectedPlayerId, existingScore]);
  
  // Calculate Stableford points when scores change
  useEffect(() => {
    if (!selectedPlayerId) return;
    
    const player = players.find(p => p.id === selectedPlayerId);
    if (!player) return;
    
    let totalStrokes = 0;
    let totalNetStrokes = 0;
    let totalPoints = 0;
    const pointsByHole: { [key: number]: number } = {};
    
    holes.forEach(hole => {
      const strokes = holeScores[hole.holeNumber] || 0;
      if (strokes === 0) return;
      
      totalStrokes += strokes;
      
      // Calculate net strokes based on handicap and stroke index
      // This is a simplified calculation - in reality it depends on exact handicap rules
      const strokesReceived = Math.floor(player.handicap / 18) + (hole.strokeIndex <= player.handicap % 18 ? 1 : 0);
      const netScore = Math.max(0, strokes - strokesReceived);
      totalNetStrokes += netScore;
      
      // Calculate Stableford points
      let points = 0;
      const parScore = hole.par;
      
      if (netScore === 0) {
        points = 0; // No score
      } else if (netScore === parScore - 3) {
        points = 5; // Albatross
      } else if (netScore === parScore - 2) {
        points = 4; // Eagle
      } else if (netScore === parScore - 1) {
        points = 3; // Birdie
      } else if (netScore === parScore) {
        points = 2; // Par
      } else if (netScore === parScore + 1) {
        points = 1; // Bogey
      } else {
        points = 0; // Double bogey or worse
      }
      
      totalPoints += points;
      pointsByHole[hole.holeNumber] = points;
    });
    
    setCalculatedScore({
      totalStrokes,
      totalNetStrokes,
      totalStablefordPoints: totalPoints,
      stablefordByHole: pointsByHole,
    });
    
  }, [selectedPlayerId, holeScores, holes, players]);
  
  const handleScoreChange = (holeNumber: number, value: string) => {
    const strokes = parseInt(value, 10);
    if (!isNaN(strokes) && strokes >= 0) {
      setHoleScores(prev => ({
        ...prev,
        [holeNumber]: strokes
      }));
    } else if (value === '') {
      // Allow clearing the input
      setHoleScores(prev => {
        const newScores = { ...prev };
        delete newScores[holeNumber];
        return newScores;
      });
    }
  };
  
  const handleSaveScore = () => {
    if (!selectedPlayerId) return;
    
    // Create holes array from holeScores object
    const holesArray = Object.keys(holeScores).map(holeNum => {
      const holeNumber = parseInt(holeNum, 10);
      return {
        holeNumber,
        strokes: holeScores[holeNumber],
        stablefordPoints: calculatedScore.stablefordByHole[holeNumber] || 0
      };
    });
    
    const scoreData: Partial<Score> = {
      id: existingScore?.id, // Use existing ID if updating
      gameId: game.id,
      playerId: selectedPlayerId,
      holes: holesArray,
      totalStrokes: calculatedScore.totalStrokes,
      totalNetStrokes: calculatedScore.totalNetStrokes,
      totalStablefordPoints: calculatedScore.totalStablefordPoints,
      isVerified: false
    };
    
    onSaveScore(scoreData);
  };
  
  const isScoreComplete = selectedPlayerId && 
    holes.every(hole => typeof holeScores[hole.holeNumber] === 'number' && holeScores[hole.holeNumber] > 0);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          <div className="flex items-center">
            <ClipboardList className="mr-2 h-6 w-6 text-golf-green" />
            Score Entry
          </div>
          <Badge className="bg-golf-green">
            {new Date(game.date).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            })}
            {' • '}
            {game.courseSide === 'front9' ? 'Front 9' : 'Back 9'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="playerId">Select Player</Label>
          <Select 
            value={selectedPlayerId} 
            onValueChange={setSelectedPlayerId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a player" />
            </SelectTrigger>
            <SelectContent>
              {players
                .filter(player => game.players.includes(player.id))
                .map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name} 
                    {scores.some(s => s.gameId === game.id && s.playerId === player.id && s.isVerified) && 
                      ' (Verified)'}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedPlayerId && (
          <>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Enter Strokes by Hole</h3>
                <div className="text-sm text-gray-500">
                  {game.courseSide === 'front9' ? 'Holes 1-9' : 'Holes 10-18'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {holes.map((hole) => (
                  <div key={hole.holeNumber} className="space-y-1">
                    <Label htmlFor={`hole-${hole.holeNumber}`} className="flex justify-between text-sm">
                      <span className="flex items-center">
                        <Flag className="h-3 w-3 mr-1" />
                        Hole {hole.holeNumber}
                      </span>
                      <span className="text-gray-500">
                        Par {hole.par} • SI {hole.strokeIndex}
                      </span>
                    </Label>
                    <div className="relative">
                      <Input
                        id={`hole-${hole.holeNumber}`}
                        type="number"
                        min="1"
                        value={holeScores[hole.holeNumber] || ''}
                        onChange={(e) => handleScoreChange(hole.holeNumber, e.target.value)}
                        className="text-center pr-10"
                      />
                      {typeof calculatedScore.stablefordByHole[hole.holeNumber] === 'number' && (
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                          {calculatedScore.stablefordByHole[hole.holeNumber]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Score Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-2 bg-white rounded shadow">
                  <p className="text-sm text-gray-500">Total Strokes</p>
                  <p className="text-xl font-bold">{calculatedScore.totalStrokes || 0}</p>
                </div>
                <div className="text-center p-2 bg-white rounded shadow">
                  <p className="text-sm text-gray-500">Net Strokes</p>
                  <p className="text-xl font-bold">{calculatedScore.totalNetStrokes || 0}</p>
                </div>
                <div className="text-center p-2 bg-white rounded shadow">
                  <p className="text-sm text-gray-500">Stableford Points</p>
                  <p className="text-xl font-bold text-golf-green">{calculatedScore.totalStablefordPoints || 0}</p>
                </div>
              </div>
            </div>
            
            {existingScore && (
              <div className="flex justify-between items-center bg-sand-beige-light p-4 rounded-md">
                <div className="flex items-center">
                  {existingScore.isVerified ? (
                    <Check className="h-5 w-5 text-golf-green mr-2" />
                  ) : (
                    <ClipboardList className="h-5 w-5 text-amber-500 mr-2" />
                  )}
                  <span className="font-medium">
                    {existingScore.isVerified ? 'Score has been verified' : 'Score needs verification'}
                  </span>
                </div>
                
                {!existingScore.isVerified && (
                  <Button 
                    variant="outline" 
                    className="border-golf-green text-golf-green hover:bg-golf-green hover:text-white"
                    onClick={() => onVerifyScore(existingScore.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Verify Score
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Back to Games
        </Button>
        <Button 
          type="button" 
          className="bg-golf-green hover:bg-golf-green-dark"
          disabled={!isScoreComplete}
          onClick={handleSaveScore}
        >
          Save Score
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ScoreEntry;
