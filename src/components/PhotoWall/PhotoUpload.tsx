
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Game, PhotoItem } from '@/types';
import { Upload, X, Image } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface PhotoUploadProps {
  games: Game[];
  players: { id: string; name: string }[];
  onUpload: (photo: Partial<PhotoItem>, file?: File) => void;
  onCancel: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  games, 
  players,
  onUpload, 
  onCancel 
}) => {
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [uploadedBy, setUploadedBy] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // For demo purposes, we'll simulate file uploads using local preview
  // In a real app, this would upload to cloud storage
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGameId || !uploadedBy || !previewUrl) {
      return;
    }
    
    setIsUploading(true);
    
    // Prepare the photo data
    const photoData: Partial<PhotoItem> = {
      id: uuidv4(),
      gameId: selectedGameId,
      url: previewUrl,
      caption: caption || undefined,
      uploadedBy,
      createdAt: new Date()
    };
    
    // Call onUpload with the file if available
    onUpload(photoData, selectedFile || undefined);
    
    // Reset the form and notify parent component
    setIsUploading(false);
    onCancel();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Upload Photo</h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="game">Game Date</Label>
          <Select 
            value={selectedGameId} 
            onValueChange={setSelectedGameId}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select game date" />
            </SelectTrigger>
            <SelectContent>
              {games.map(game => (
                <SelectItem key={game.id} value={game.id}>
                  {new Date(game.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                  {' - '}
                  {game.courseSide === 'front9' ? 'Front 9' : 'Back 9'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="uploader">Uploaded By</Label>
          <Select 
            value={uploadedBy} 
            onValueChange={setUploadedBy}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select uploader" />
            </SelectTrigger>
            <SelectContent>
              {players.map(player => (
                <SelectItem key={player.id} value={player.id}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="caption">Caption (Optional)</Label>
          <Textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption to this photo..."
            className="resize-none"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="photo">Photo</Label>
          <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center ${
              previewUrl ? 'border-golf-green' : 'border-gray-300'
            }`}
          >
            {previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-64 mx-auto object-contain" 
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-white"
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="py-8 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Click to select or drag and drop a photo
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, GIF up to 10MB
                </p>
              </div>
            )}
            <Input
              ref={fileInputRef}
              id="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              required={!previewUrl}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-golf-green hover:bg-golf-green-dark"
            disabled={!previewUrl || !selectedGameId || !uploadedBy || isUploading}
          >
            {isUploading ? (
              <>Uploading...</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PhotoUpload;
