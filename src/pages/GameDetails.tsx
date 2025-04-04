
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useGolfState } from '@/hooks/useGolfState';
import { valleDelEsteCourse } from '@/data/courseData';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Flag, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  StickyNote, 
  User 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseSide } from '@/types';

const GameDetails = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { games, players, scores, isLoading } = useGolfState();
  
  const game = games.find(g => g.id === gameId);
  
  // Get players for this game
  const gamePlayers = game 
    ? players.filter(player => game.players.includes(player.id))
    : [];
  
  // Get scores for this game
  const gameScores = scores.filter(score => score.gameId === gameId);
  
  // Get course data based on course side
  const courseData = game 
    ? valleDelEsteCourse[game.courseSide as CourseSide] 
    : [];
  
  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Layout>
    );
  }
  
  if (!game) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-2">Game Not Found</h2>
          <p className="mb-4">The game you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Game Info Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Game Details</CardTitle>
              <CardDescription>
                {new Date(game.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-golf-green" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{new Date(game.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-golf-green" />
                  <div>
                    <p className="text-sm text-gray-500">Tee Time</p>
                    <p className="font-medium">{game.teeTime}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-golf-green" />
                  <div>
                    <p className="text-sm text-gray-500">Course Side</p>
                    <p className="font-medium">{game.courseSide === 'front9' ? 'Front 9' : 'Back 9'}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                  <Users className="h-5 w-5 text-golf-green" />
                  <div>
                    <p className="text-sm text-gray-500">Players</p>
                    <p className="font-medium">{game.players.length}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg flex items-start space-x-3">
                  <Flag className="h-5 w-5 text-golf-green mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center mt-1">
                      {game.isComplete ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                          <span className="font-medium text-green-700">Completed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-amber-500 mr-1.5" />
                          <span className="font-medium text-amber-700">Upcoming</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Players Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Players</CardTitle>
              <CardDescription>Registered players for this game</CardDescription>
            </CardHeader>
            <CardContent>
              {gamePlayers.length > 0 ? (
                <div className="space-y-3">
                  {gamePlayers.map(player => {
                    const playerScore = gameScores.find(score => score.playerId === player.id);
                    return (
                      <Link to={`/players/${player.id}`} key={player.id}>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <div className="bg-golf-green rounded-full w-8 h-8 flex items-center justify-center text-white font-medium">
                              {player.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{player.name}</p>
                              <p className="text-xs text-gray-500">
                                HC: {player.handicap} • {player.preferredTee === 'yellow' ? 'Yellow' : 'Red'} tees
                              </p>
                            </div>
                          </div>
                          {playerScore && (
                            <Badge variant={playerScore.totalStablefordPoints > 20 ? "default" : "secondary"}>
                              {playerScore.totalStablefordPoints} pts
                            </Badge>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No players registered yet</p>
              )}
            </CardContent>
          </Card>
          
          {/* Notes Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Notes</CardTitle>
              <CardDescription>Additional information</CardDescription>
            </CardHeader>
            <CardContent>
              {game.notes ? (
                <div className="bg-gray-50 p-4 rounded-lg flex items-start space-x-3">
                  <StickyNote className="h-5 w-5 text-golf-green shrink-0 mt-0.5" />
                  <p className="text-gray-700">{game.notes}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <StickyNote className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No notes for this game</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Scores Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Game Scores</CardTitle>
            <CardDescription>Scorecard for all players</CardDescription>
          </CardHeader>
          <CardContent>
            {gameScores.length > 0 ? (
              <Tabs defaultValue="leaderboard">
                <TabsList className="mb-4">
                  <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                  <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
                </TabsList>
                
                <TabsContent value="leaderboard">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead>Gross</TableHead>
                        <TableHead>Net</TableHead>
                        <TableHead>Stableford</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Profile</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gameScores
                        .sort((a, b) => b.totalStablefordPoints - a.totalStablefordPoints)
                        .map((score, index) => {
                          const player = players.find(p => p.id === score.playerId);
                          return (
                            <TableRow key={score.id}>
                              <TableCell className="font-medium">{index + 1}</TableCell>
                              <TableCell>{player?.name || 'Unknown'}</TableCell>
                              <TableCell>{score.totalStrokes}</TableCell>
                              <TableCell>{score.totalNetStrokes}</TableCell>
                              <TableCell className="font-bold">{score.totalStablefordPoints}</TableCell>
                              <TableCell>
                                {score.isVerified ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {player && (
                                  <Link to={`/players/${player.id}`}>
                                    <Button variant="ghost" size="sm">View</Button>
                                  </Link>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="scorecard">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="sticky left-0 bg-white z-10">Player</TableHead>
                          {courseData.map(hole => (
                            <TableHead key={hole.holeNumber} className="text-center">
                              {hole.holeNumber}
                            </TableHead>
                          ))}
                          <TableHead className="text-center">Total</TableHead>
                          <TableHead className="text-center">Points</TableHead>
                        </TableRow>
                        <TableRow className="bg-muted/50">
                          <TableHead className="sticky left-0 bg-muted/50 z-10">Par</TableHead>
                          {courseData.map(hole => (
                            <TableHead key={hole.holeNumber} className="text-center">
                              {hole.par}
                            </TableHead>
                          ))}
                          <TableHead className="text-center">
                            {courseData.reduce((sum, hole) => sum + hole.par, 0)}
                          </TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {gameScores.map(score => {
                          const player = players.find(p => p.id === score.playerId);
                          return (
                            <TableRow key={score.id}>
                              <TableCell className="sticky left-0 bg-white z-10 font-medium">
                                <Link to={`/players/${player?.id}`} className="hover:underline flex items-center space-x-1">
                                  <span>{player?.name || 'Unknown'}</span>
                                  <User className="h-3.5 w-3.5 ml-1 text-gray-400" />
                                </Link>
                              </TableCell>
                              {courseData.map(hole => {
                                const holeScore = score.holes.find(h => h.holeNumber === hole.holeNumber);
                                const strokes = holeScore ? holeScore.strokes : null;
                                const points = holeScore ? holeScore.stablefordPoints : null;
                                
                                // Determine cell styling based on score relative to par
                                let bgColor = '';
                                if (strokes !== null) {
                                  if (strokes < hole.par) bgColor = 'bg-green-50 text-green-800';
                                  else if (strokes === hole.par) bgColor = '';
                                  else if (strokes === hole.par + 1) bgColor = 'bg-yellow-50 text-yellow-800';
                                  else bgColor = 'bg-red-50 text-red-800';
                                }
                                
                                return (
                                  <TableCell 
                                    key={hole.holeNumber} 
                                    className={`text-center ${bgColor}`}
                                  >
                                    {strokes !== null ? (
                                      <span className="relative">
                                        {strokes}
                                        {points !== null && (
                                          <span className="absolute top-0 right-0 translate-x-2 -translate-y-1 text-xs text-gray-500">
                                            {points}
                                          </span>
                                        )}
                                      </span>
                                    ) : '-'}
                                  </TableCell>
                                );
                              })}
                              <TableCell className="text-center font-bold">
                                {score.totalStrokes}
                              </TableCell>
                              <TableCell className="text-center font-bold text-golf-green">
                                {score.totalStablefordPoints}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-1">No scores recorded for this game yet</p>
                {!game.isComplete && (
                  <p className="text-gray-400 text-sm">Scores will appear here after the game is completed</p>
                )}
              </div>
            )}
          </CardContent>
          {game.isVerified && (
            <CardFooter className="bg-green-50 text-green-800 text-sm">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              All scores for this game have been verified
            </CardFooter>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default GameDetails;
