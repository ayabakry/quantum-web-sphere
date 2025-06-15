
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import ContentTable from '@/components/admin/ContentTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { VideoData } from '@/components/videos/VideoCard';
import { useSharedData } from '@/context/SharedDataContext';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'channelName', label: 'Channel' },
  { key: 'uploadedAt', label: 'Published Date' },
];

// Improved YouTube thumbnail generation
const getYoutubeThumbnail = (url: string): string => {
  console.log('Generating thumbnail for:', url);
  
  // Extract video ID using the same logic as VideoPlayer
  const getVideoId = (url: string) => {
    if (url && url.length === 11 && !url.includes('http') && !url.includes('.')) {
      return url;
    }

    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.substring(1).split('?')[0];
      } 
      if (urlObj.hostname.includes('youtube.com')) {
        const searchParams = new URLSearchParams(urlObj.search);
        return searchParams.get('v');
      }
    } catch (error) {
      if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split('?')[0].split('&')[0];
      } 
      if (url.includes('youtube.com/watch?v=')) {
        return url.split('v=')[1].split('&')[0];
      }
    }
    
    return url;
  };

  const videoId = getVideoId(url);
  if (videoId) {
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    console.log('Generated thumbnail:', thumbnail);
    return thumbnail;
  }
  
  console.log('Could not generate thumbnail, using placeholder');
  return '/placeholder.svg';
};

const AdminVideos = () => {
  const { toast } = useToast();
  const { videos, setVideos, updateRecentUpdates } = useSharedData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<VideoData>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddVideo = () => {
    setFormData({});
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleEditVideo = (id: string) => {
    const videoToEdit = videos.find(v => v.id === id);
    if (videoToEdit) {
      setFormData({ ...videoToEdit });
      setEditingId(id);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteVideo = (id: string) => {
    const updatedVideos = videos.filter(v => v.id !== id);
    setVideos(updatedVideos);
    updateRecentUpdates();
    
    toast({
      title: "Video deleted",
      description: "The video has been removed successfully",
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Form submitted with data:', formData);
    
    // Generate thumbnail from YouTube URL
    const thumbnailUrl = getYoutubeThumbnail(formData.id);
    
    if (editingId) {
      // Update existing video
      const updatedVideos = videos.map(v => 
        v.id === editingId ? { 
          ...v, 
          ...formData,
          thumbnailUrl 
        } as VideoData : v
      );
      setVideos(updatedVideos);
      updateRecentUpdates();
      
      toast({
        title: "Video updated",
        description: "The video has been updated successfully",
      });
    } else {
      // Add new video
      const newVideo = {
        ...formData,
        id: formData.id,
        thumbnailUrl,
        videoUrl: formData.id, // Store the original URL as videoUrl too
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      } as VideoData;
      
      console.log('Adding new video:', newVideo);
      setVideos([...videos, newVideo]);
      updateRecentUpdates();
      
      toast({
        title: "Video added",
        description: "The new video has been added successfully",
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Videos</h1>
        <Button onClick={handleAddVideo}>
          <Plus className="h-4 w-4 mr-2" /> Add Video
        </Button>
      </div>
      
      <ContentTable
        columns={columns}
        data={videos}
        onEdit={handleEditVideo}
        onDelete={handleDeleteVideo}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Video' : 'Add New Video'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update the video details below'
                : 'Enter the details for the new video'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Video Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="id">YouTube URL</Label>
              <Input
                id="id"
                name="id"
                value={formData.id || ''}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
                required
              />
              <p className="text-xs text-muted-foreground">
                Enter a full YouTube URL or just the video ID. Thumbnails will be automatically generated.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="channelName">Channel Name</Label>
              <Input
                id="channelName"
                name="channelName"
                value={formData.channelName || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Update Video' : 'Add Video'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminVideos;
