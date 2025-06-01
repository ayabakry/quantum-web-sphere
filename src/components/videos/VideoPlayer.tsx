
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

  // Extract YouTube video ID from URL
  const getVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.substring(1);
      } else if (urlObj.hostname.includes('youtube.com')) {
        const searchParams = new URLSearchParams(urlObj.search);
        return searchParams.get('v');
      }
    } catch (error) {
      // If URL parsing fails, try simple string extraction
      if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('youtube.com/watch?v=')) {
        return url.split('v=')[1].split('&')[0];
      }
    }
    
    return url; // Assume it's already an ID
  };

  const videoId = getVideoId(video.id);

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
