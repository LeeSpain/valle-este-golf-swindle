import React, { useState } from 'react';
import Layout from '@/components/Layout';
import GameList from '@/components/Admin/GameList';
import GameForm from '@/components/Admin/GameForm';
import ScoreEntry from '@/components/Admin/ScoreEntry';
import { useGolfState } from '@/hooks/useGolfState';
import { Game, Score } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { valleDelEsteCourse } from '@/data/courseData';

const Games = () => {
  const { games, players, scores, isLoading, addGame, updateGame, deleteGame, saveScore, verifyScore } = useGolfState();
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [scoreEntry, setScoreEntry] = useState<Game | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  
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
      addGame(gameData);
    }
    setShowForm(false);
  };
  
  const handleCancel = () => {
    setShowForm(false);
  };
  
  const handleManageScores = (game: Game) => {
    setScoreEntry(game);
  };
  
  const handleSaveScore = (scoreData: Partial<Score>) => {
    saveScore(scoreData);
  };
  
  const handleVerifyScore = (scoreId: string) => {
    verifyScore(scoreId);
  };
  
  const handleScoreEntryCancel = () => {
    setScoreEntry(null);
  };

  return (
    <Layout isAdmin>
      <div className="space-y-6">
        {!showForm && !scoreEntry && (
          <GameList 
            games={games}
            players={players}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddNew={handleAddNew}
            onManageScores={handleManageScores}
            isLoading={isLoading}
          />
        )}
        
        {showForm && (
          <GameForm 
            game={editingGame || {}}
            players={players}
            isEditing={!!editingGame}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        )}
        
        {scoreEntry && (
          <ScoreEntry 
            game={scoreEntry}
            players={players}
            scores={scores.filter(s => s.gameId === scoreEntry.id)}
            courseData={valleDelEsteCourse}
            onSaveScore={handleSaveScore}
            onVerifyScore={handleVerifyScore}
            onCancel={handleScoreEntryCancel}
          />
        )}
        
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
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
