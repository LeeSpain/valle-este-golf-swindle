
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useGolfState } from '@/hooks/useGolfState';
import { Button } from '@/components/ui/button';
import { Users, Calendar, ClipboardList, Image, ChevronRight, TrendingUp, AlertCircle, UserPlus, CheckCircle } from 'lucide-react';
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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-golf-green to-golf-green-light">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage games, players and scores</p>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Users className="mr-2 h-4 w-4 text-golf-green" />
                    Total Players
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{players.length}</div>
                  {newPlayers > 0 && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                      <UserPlus className="mr-1 h-3 w-3 text-green-500" />
                      +{newPlayers} new in last 30 days
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-golf-green" />
                    Games Scheduled
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{games.length}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                    {completedGames} completed
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <ClipboardList className="mr-2 h-4 w-4 text-golf-green" />
                    Pending Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{pendingScores}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    {pendingScores > 0 ? (
                      <>
                        <AlertCircle className="mr-1 h-3 w-3 text-amber-500" />
                        Need verification
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
                        All scores verified
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                    <Image className="mr-2 h-4 w-4 text-golf-green" />
                    Photo Wall
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{photos.length}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    Total photos uploaded
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main admin functions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Player Management Card */}
              <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <CardHeader className="bg-gradient-to-r from-golf-green-light/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-golf-green" />
                    <span>Player Management</span>
                  </CardTitle>
                  <CardDescription>
                    Manage the player roster, handicaps, and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-sm">
                    <p><strong>{players.length}</strong> players in the address book</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="default">
                    <Link to="/admin/players" className="flex items-center">
                      Manage Players
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Game Management Card */}
              <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <CardHeader className="bg-gradient-to-r from-golf-green-light/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-golf-green" />
                    <span>Game Management</span>
                  </CardTitle>
                  <CardDescription>
                    Schedule games, select participants, and choose course side
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-sm">
                    {upcomingGame ? (
                      <p>Next game: <strong>{new Date(upcomingGame.date).toLocaleDateString()}</strong> at {upcomingGame.teeTime}</p>
                    ) : (
                      <p>No upcoming games scheduled</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="default">
                    <Link to="/admin/games" className="flex items-center">
                      Manage Games
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Score Management Card */}
              <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <CardHeader className="bg-gradient-to-r from-golf-green-light/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-golf-green" />
                    <span>Score Management</span>
                  </CardTitle>
                  <CardDescription>
                    Enter player scores, verify results, and update handicaps
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-sm">
                    <p><strong>{pendingScores}</strong> scores pending verification</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="default">
                    <Link to="/admin/scores" className="flex items-center">
                      Manage Scores
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Photo Wall Management Card */}
              <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <CardHeader className="bg-gradient-to-r from-golf-green-light/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-golf-green" />
                    <span>Photo Wall</span>
                  </CardTitle>
                  <CardDescription>
                    Upload and manage photos from games and events
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-sm">
                    <p><strong>{photos.length}</strong> photos in the gallery</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button asChild variant="default">
                    <Link to="/photos" className="flex items-center">
                      Manage Photos
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
