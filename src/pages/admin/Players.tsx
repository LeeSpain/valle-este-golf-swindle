import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PlayerList from '@/components/Admin/PlayerList';
import PlayerForm from '@/components/Admin/PlayerForm';
import { useGolfState } from '@/hooks/useGolfState';
import { Player } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Players = () => {
  const { players, isLoading, addPlayer, updatePlayer, deletePlayer } = useGolfState();
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const handleAddNew = () => {
    setEditingPlayer(null);
    setShowForm(true);
  };
  
  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setShowForm(true);
  };
  
  const handleDelete = (playerId: string) => {
    setDeleteConfirm(playerId);
  };
  
  const confirmDelete = () => {
    if (deleteConfirm) {
      deletePlayer(deleteConfirm);
      setDeleteConfirm(null);
    }
  };
  
  const handleFormSubmit = (playerData: Partial<Player>) => {
    if (editingPlayer) {
      updatePlayer(editingPlayer.id, playerData);
    } else {
      addPlayer(playerData);
    }
    setShowForm(false);
  };
  
  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <Layout isAdmin>
      <div className="space-y-6">
        {!showForm ? (
          <PlayerList 
            players={players}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddNew={handleAddNew}
            isLoading={isLoading}
          />
        ) : (
          <PlayerForm 
            player={editingPlayer || {}}
            isEditing={!!editingPlayer}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        )}
        
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the player from the roster. This action cannot be undone.
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

export default Players;
