
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import GameList from '@/components/Admin/GameList';
import GameForm from '@/components/Admin/GameForm';
import ScoreEntry from '@/components/Admin/ScoreEntry';
import PlayerCheckIn from '@/components/Admin/PlayerCheckIn';
import { useGolfState } from '@/hooks/useGolfState';
import { Game, Score } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { valleDelEsteCourse } from '@/data/courseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ClipboardList, Users, CheckCircle } from 'lucide-react';

const Games = () => {
  const { games, players, scores, isLoading, addGame, updateGame, deleteGame, saveScore, verifyScore } = useGolfState();
  
  // State is explicitly set to false to show the game list by default
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [scoreEntry, setScoreEntry] = useState<Game | null>(null);
  const [checkInGame, setCheckInGame] = useState<Game | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Reset state when component mounts to ensure we're always starting fresh
  useEffect(() => {
    setShowForm(false);
    setEditingGame(null);
    setScoreEntry(null);
    setCheckInGame(null);
    setDeleteConfirm(null);
  }, []);
  
  console.log("Games component state:", { 
    showForm, 
    editingGame: editingGame?.id || null,
    scoreEntry: scoreEntry?.id || null,
    checkInGame: checkInGame?.id || null,
    gamesCount: games?.length || 0,
    isLoading
  });
  
  const handleAddNew = () => {
    setEditingGame(null);
    setShowForm(true);
  };
  
  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setShowForm(true);
  };
  
  const handleDelete = (gameId: string) => {
    setDeleteConfirm(gameId);
  };
  
  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteGame(deleteConfirm);
      setDeleteConfirm(null);
    }
  };
  
  const handleFormSubmit = (gameData: Partial<Game>) => {
    if (editingGame) {
      updateGame(editingGame.id, gameData);
    } else {
      // Ensure all required fields are present for new games
      const newGame = {
        date: gameData.date || new Date(),
        teeTime: gameData.teeTime || '12:00',
        courseSide: gameData.courseSide || 'front9',
        players: gameData.players || [],
        playerStatus: gameData.playerStatus || [],
        isComplete: gameData.isComplete || false,
        isVerified: gameData.isVerified || false,
        notes: gameData.notes || ''
      };
      addGame(newGame);
    }
    setShowForm(false);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setScoreEntry(null);
    setCheckInGame(null);
  };
  
  const handleManageScores = (game: Game) => {
    setScoreEntry(game);
  };
  
  const handleCheckIn = (game: Game) => {
    setCheckInGame(game);
  };
  
  const handleUpdateGamePlayers = (updatedGame: Partial<Game>) => {
    if (checkInGame) {
      updateGame(checkInGame.id, updatedGame);
      // Update the local state to reflect changes
      setCheckInGame({
        ...checkInGame,
        ...updatedGame
      } as Game);
    }
  };
  
  const handleSaveScore = (scoreData: Partial<Score>) => {
    // Create a complete Score object to pass to saveScore
    if (scoreData.gameId && scoreData.playerId && scoreData.holes) {
      const completeScore: Score = {
        id: scoreData.id || '', // ID will be generated on the server if not provided
        gameId: scoreData.gameId,
        playerId: scoreData.playerId,
        holes: scoreData.holes,
        totalStrokes: scoreData.totalStrokes || 0,
        totalNetStrokes: scoreData.totalNetStrokes || 0,
        totalStablefordPoints: scoreData.totalStablefordPoints || 0,
        isVerified: scoreData.isVerified || false,
        createdAt: scoreData.createdAt || new Date(),
        updatedAt: scoreData.updatedAt || new Date()
      };
      
      saveScore(completeScore);
    }
  };
  
  const handleVerifyScore = (scoreId: string) => {
    verifyScore(scoreId);
  };
  
  const handleScoreEntryCancel = () => {
    setScoreEntry(null);
  };

  const handleCompleteGame = (game: Game) => {
    updateGame(game.id, { isComplete: true });
  };

  const pageTitle = () => {
    if (checkInGame) return 'Player Check-In';
    if (scoreEntry) return 'Score Entry';
    if (showForm) return editingGame ? 'Edit Game' : 'Schedule New Game';
    return 'Game Management';
  };
  
  const pageDescription = () => {
    if (checkInGame) return `Check in players for ${new Date(checkInGame.date).toLocaleDateString()}`;
    if (scoreEntry) return `Enter scores for ${new Date(scoreEntry.date).toLocaleDateString()}`;
    if (showForm) return editingGame ? 'Update game details' : 'Schedule a new game';
    return 'View and manage all scheduled games';
  };

  if (isLoading) {
    return (
      <Layout isAdmin>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-golf-green to-golf-green-light">
            {pageTitle()}
          </h1>
          <p className="text-muted-foreground mt-1">
            {pageDescription()}
          </p>
        </div>
        
        {!showForm && !scoreEntry && !checkInGame && (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-golf-green-light/10 to-transparent pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calendar className="h-5 w-5 text-golf-green" />
                <span>Game Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <GameList 
                games={games}
                players={players}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddNew={handleAddNew}
                onManageScores={handleManageScores}
                onCheckIn={handleCheckIn}
                onCompleteGame={handleCompleteGame}
                isLoading={false}
              />
            </CardContent>
          </Card>
        )}
        
        {showForm && (
          <Card className="border-none shadow-lg animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-golf-green-light/10 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calendar className="h-5 w-5 text-golf-green" />
                <span>{editingGame ? 'Edit Game Details' : 'Schedule New Game'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GameForm 
                game={editingGame || {}}
                players={players}
                isEditing={!!editingGame}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        )}
        
        {checkInGame && (
          <Card className="border-none shadow-lg animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-golf-green-light/10 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5 text-golf-green" />
                <span>Player Check-In for {new Date(checkInGame.date).toLocaleDateString()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PlayerCheckIn 
                game={checkInGame}
                players={players.filter(player => checkInGame.players.includes(player.id))}
                availablePlayers={players}
                onUpdateGamePlayers={handleUpdateGamePlayers}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        )}
        
        {scoreEntry && (
          <Card className="border-none shadow-lg animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-golf-green-light/10 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ClipboardList className="h-5 w-5 text-golf-green" />
                <span>Score Entry for {new Date(scoreEntry.date).toLocaleDateString()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScoreEntry 
                game={scoreEntry}
                players={players}
                scores={scores.filter(s => s.gameId === scoreEntry.id)}
                courseData={valleDelEsteCourse}
                onSaveScore={handleSaveScore}
                onVerifyScore={handleVerifyScore}
                onCancel={handleScoreEntryCancel}
              />
            </CardContent>
          </Card>
        )}
        
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent className="border-none">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this game. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default Games;
