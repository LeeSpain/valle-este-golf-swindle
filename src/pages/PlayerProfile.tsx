
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useGolfState } from '@/hooks/useGolfState';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Smartphone, 
  Facebook, 
  Mail, 
  Calendar, 
  Flag, 
  Trophy, 
  ArrowLeft 
} from 'lucide-react';

const PlayerProfile = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const { players, games, scores, isLoading } = useGolfState();
  
  const player = players.find(p => p.id === playerId);
  
  // Get games this player participated in
  const playerGames = games.filter(game => 
    game.players.includes(playerId || '')
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get scores for this player
  const playerScores = scores.filter(score => 
    score.playerId === playerId
  );
  
  // Calculate stats
  const gamesPlayed = playerGames.length;
  const averagePoints = playerScores.length > 0 
    ? playerScores.reduce((sum, score) => sum + score.totalStablefordPoints, 0) / playerScores.length 
    : 0;
  const highestScore = playerScores.length > 0 
    ? Math.max(...playerScores.map(score => score.totalStablefordPoints))
    : 0;
  
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
  
  if (!player) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-2">Player Not Found</h2>
          <p className="mb-4">The player you're looking for doesn't exist.</p>
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
          <Link to="/leaderboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leaderboard
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Player Info Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Player Profile</CardTitle>
              <CardDescription>Personal Information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=random`} />
                  <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{player.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    Handicap: {player.handicap}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-500 w-24">Gender:</span>
                  <span className="font-medium">{player.gender === 'male' ? 'Male' : 'Female'}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Flag className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-500 w-24">Preferred Tee:</span>
                  <span className="font-medium capitalize">{player.preferredTee}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-500 w-24">Email:</span>
                  <span className="font-medium">{player.email}</span>
                </div>
                {player.phone && (
                  <div className="flex items-center text-sm">
                    <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-500 w-24">Phone:</span>
                    <span className="font-medium">{player.phone}</span>
                  </div>
                )}
                {player.facebookLink && (
                  <div className="flex items-center text-sm">
                    <Facebook className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-500 w-24">Facebook:</span>
                    <a 
                      href={player.facebookLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Profile
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Stats Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Player Statistics</CardTitle>
              <CardDescription>Performance Summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Games Played</p>
                  <p className="text-2xl font-bold">{gamesPlayed}</p>
                </div>
                <Calendar className="h-8 w-8 text-golf-green" />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg. Stableford</p>
                  <p className="text-2xl font-bold">{averagePoints.toFixed(1)}</p>
                </div>
                <Trophy className="h-8 w-8 text-golf-green" />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Best Score</p>
                  <p className="text-2xl font-bold">{highestScore}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Games Card */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Recent Games</CardTitle>
              <CardDescription>Last {Math.min(playerGames.length, 5)} games played</CardDescription>
            </CardHeader>
            <CardContent>
              {playerGames.length > 0 ? (
                <div className="space-y-3">
                  {playerGames.slice(0, 5).map(game => {
                    const gameScore = playerScores.find(score => score.gameId === game.id);
                    return (
                      <Link to={`/games/${game.id}`} key={game.id}>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                          <div>
                            <p className="font-medium">{new Date(game.date).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500">
                              {game.courseSide === 'front9' ? 'Front 9' : 'Back 9'}
                            </p>
                          </div>
                          {gameScore && (
                            <Badge variant={gameScore.totalStablefordPoints > 20 ? "default" : "secondary"}>
                              {gameScore.totalStablefordPoints} pts
                            </Badge>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No games played yet</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Game History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Game History</CardTitle>
            <CardDescription>Complete history of games and scores</CardDescription>
          </CardHeader>
          <CardContent>
            {playerGames.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Course Side</TableHead>
                    <TableHead>Strokes</TableHead>
                    <TableHead>Net Strokes</TableHead>
                    <TableHead>Stableford Points</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playerGames.map(game => {
                    const gameScore = playerScores.find(score => score.gameId === game.id);
                    return (
                      <TableRow key={game.id}>
                        <TableCell className="font-medium">{new Date(game.date).toLocaleDateString()}</TableCell>
                        <TableCell>{game.courseSide === 'front9' ? 'Front 9' : 'Back 9'}</TableCell>
                        <TableCell>{gameScore ? gameScore.totalStrokes : '-'}</TableCell>
                        <TableCell>{gameScore ? gameScore.totalNetStrokes : '-'}</TableCell>
                        <TableCell>{gameScore ? gameScore.totalStablefordPoints : '-'}</TableCell>
                        <TableCell>
                          {gameScore ? (
                            gameScore.isVerified ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
                            )
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">No Score</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/games/${game.id}`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-center py-4">No game history available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PlayerProfile;
