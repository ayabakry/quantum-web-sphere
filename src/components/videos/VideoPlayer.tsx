
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoData } from './VideoCard';

interface VideoPlayerProps {
  video: VideoData | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  if (!video) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Select a Video</CardTitle>
          <CardDescription>Choose a video from the list to watch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted/50 flex items-center justify-center rounded-md">
            <p className="text-muted-foreground">No video selected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Improved YouTube video ID extraction with better error handling
  const getVideoId = (url: string) => {
    console.log('Extracting video ID from:', url);
    
    // If it's already a video ID (11 characters), return it
    if (url && url.length === 11 && !url.includes('http') && !url.includes('.')) {
      console.log('Already a video ID:', url);
      return url;
    }

    try {
      const urlObj = new URL(url);
      
      // Handle youtu.be URLs
      if (urlObj.hostname === 'youtu.be') {
        const id = urlObj.pathname.substring(1).split('?')[0];
        console.log('Extracted from youtu.be:', id);
        return id;
      } 
      
      // Handle youtube.com URLs
      if (urlObj.hostname.includes('youtube.com')) {
        const searchParams = new URLSearchParams(urlObj.search);
        const id = searchParams.get('v');
        console.log('Extracted from youtube.com:', id);
        return id;
      }
    } catch (error) {
      console.log('URL parsing failed, trying string extraction:', error);
      
      // Fallback: try simple string extraction
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
        console.log('Extracted with string method from youtu.be:', id);
        return id;
      } 
      
      if (url.includes('youtube.com/watch?v=')) {
        const id = url.split('v=')[1].split('&')[0];
        console.log('Extracted with string method from youtube.com:', id);
        return id;
      }
    }
    
    console.log('No extraction method worked, returning original:', url);
    return url; // Return original if nothing works
  };

  const videoId = getVideoId(video.id);
  console.log('Final video ID for embedding:', videoId);

  // Don't render if we don't have a valid video ID
  if (!videoId) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{video.title}</CardTitle>
          <CardDescription>{video.channelName} • {video.uploadedAt}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted/50 flex items-center justify-center rounded-md">
            <p className="text-muted-foreground">Invalid video URL</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{video.title}</CardTitle>
        <CardDescription>{video.channelName} • {video.uploadedAt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-md overflow-hidden">
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${videoId}`}
            title={video.title}
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{video.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
