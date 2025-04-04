
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useGolfState } from '@/hooks/useGolfState';
import { Button } from '@/components/ui/button';
import { Users, Calendar, ClipboardList, Photo, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const { 
    players, 
    games, 
    scores, 
    photos,
    getNextGame,
    isLoading 
  } = useGolfState();
  
  const upcomingGame = getNextGame();
  const pendingScores = scores.filter(score => !score.isVerified).length;
  
  // Count completed games
  const completedGames = games.filter(game => game.isComplete).length;
  
  // Get newly added players (in the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newPlayers = players.filter(player => new Date(player.createdAt) >= thirtyDaysAgo).length;

  return (
    <Layout isAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Badge className="bg-sand-beige text-golf-green px-3 py-1 text-sm">
              Admin Area
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="h-32 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-full bg-gray-200 rounded-md"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Quick stats row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Players</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{players.length}</div>
                  {newPlayers > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      +{newPlayers} new in last 30 days
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Games Scheduled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{games.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedGames} completed
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Scores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{pendingScores}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Need verification
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Photo Wall</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{photos.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total photos uploaded
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main admin functions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Player Management Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-golf-green" />
                    <span>Player Management</span>
                  </CardTitle>
                  <CardDescription>
                    Manage the player roster, handicaps, and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p><strong>{players.length}</strong> players in the address book</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="outline">
                    <Link to="/admin/players">
                      Manage Players
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Game Management Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-golf-green" />
                    <span>Game Management</span>
                  </CardTitle>
                  <CardDescription>
                    Schedule games, select participants, and choose course side
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    {upcomingGame ? (
                      <p>Next game: <strong>{new Date(upcomingGame.date).toLocaleDateString()}</strong> at {upcomingGame.teeTime}</p>
                    ) : (
                      <p>No upcoming games scheduled</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="outline">
                    <Link to="/admin/games">
                      Manage Games
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Score Management Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-golf-green" />
                    <span>Score Management</span>
                  </CardTitle>
                  <CardDescription>
                    Enter player scores, verify results, and update handicaps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p><strong>{pendingScores}</strong> scores pending verification</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="outline">
                    <Link to="/admin/scores">
                      Manage Scores
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Photo Wall Management Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Photo className="h-5 w-5 text-golf-green" />
                    <span>Photo Wall</span>
                  </CardTitle>
                  <CardDescription>
                    Upload and manage photos from games and events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p><strong>{photos.length}</strong> photos in the gallery</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="outline">
                    <Link to="/photos">
                      Manage Photos
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
