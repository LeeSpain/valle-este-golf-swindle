
import React, { useState, useCallback } from 'react';
import Layout from '@/components/Layout';
import PlayerList from '@/components/Admin/PlayerList';
import PlayerForm from '@/components/Admin/PlayerForm';
import { useGolfState } from '@/hooks/useGolfState';
import { Player } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Players = () => {
  // Get players data with useGolfState hook
  const { players, isLoading, addPlayer, updatePlayer, deletePlayer } = useGolfState();
  
  // Local state for UI
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Debug output
  console.log("Players admin page state:", { 
    playersCount: players.length, 
    isLoading, 
    showForm, 
    isEditing: !!editingPlayer 
  });
  
  // Memoized handlers to prevent unnecessary re-renders
  const handleAddNew = useCallback(() => {
    setEditingPlayer(null);
    setShowForm(true);
  }, []);
  
  const handleEdit = useCallback((player: Player) => {
    setEditingPlayer(player);
    setShowForm(true);
  }, []);
  
  const handleDelete = useCallback((playerId: string) => {
    setDeleteConfirm(playerId);
  }, []);
  
  const confirmDelete = useCallback(() => {
    if (deleteConfirm) {
      deletePlayer(deleteConfirm)
        .then(success => {
          if (success) {
            toast({
              title: "Player deleted",
              description: "Player has been removed successfully"
            });
          }
        })
        .catch(err => {
          console.error("Error deleting player:", err);
          toast({
            title: "Error",
            description: "Failed to delete player",
            variant: "destructive"
          });
        });
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, deletePlayer]);
  
  const handleFormSubmit = useCallback((playerData: Partial<Player>) => {
    if (editingPlayer) {
      updatePlayer(editingPlayer.id, playerData)
        .then(success => {
          if (success) {
            toast({
              title: "Player updated",
              description: "Player details have been updated successfully"
            });
            setShowForm(false);
          }
        })
        .catch(err => {
          console.error("Error updating player:", err);
          toast({
            title: "Error",
            description: "Failed to update player",
            variant: "destructive"
          });
        });
    } else {
      // Ensure all required fields are present for new players
      const newPlayer = {
        name: playerData.name || 'New Player',
        email: playerData.email || 'player@example.com',
        handicap: playerData.handicap || 0,
        gender: playerData.gender || 'male',
        preferredTee: playerData.preferredTee || 'yellow'
      };
      
      addPlayer(newPlayer)
        .then(success => {
          if (success) {
            toast({
              title: "Player added",
              description: "New player has been added successfully"
            });
            setShowForm(false);
          }
        })
        .catch(err => {
          console.error("Error adding player:", err);
          toast({
            title: "Error",
            description: "Failed to add player",
            variant: "destructive"
          });
        });
    }
  }, [editingPlayer, updatePlayer, addPlayer]);
  
  const handleCancel = useCallback(() => {
    setShowForm(false);
  }, []);
  
  return (
    <Layout isAdmin>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-golf-green to-golf-green-light">
            {showForm ? (editingPlayer ? 'Edit Player' : 'Add New Player') : 'Player Management'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {showForm 
              ? 'Update player information' 
              : 'View and manage all registered players in the swindle'}
          </p>
        </div>
        
        {!showForm ? (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-golf-green-light/10 to-transparent pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5 text-golf-green" />
                <span>Player Roster</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <PlayerList 
                players={players}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddNew={handleAddNew}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-lg animate-fade-in">
            <CardHeader className="bg-gradient-to-r from-golf-green-light/10 to-transparent pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-5 w-5 text-golf-green" />
                <span>{editingPlayer ? 'Edit Player Details' : 'Add New Player'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PlayerForm 
                player={editingPlayer || {}}
                isEditing={!!editingPlayer}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
              />
            </CardContent>
          </Card>
        )}
        
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent className="border-none">
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
