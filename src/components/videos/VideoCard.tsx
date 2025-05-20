
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getYoutubeThumbnail, syncData } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface VideoData {
  id: string;
  title: string;
  thumbnail?: string;
  channelName: string;
  publishedAt: string;
  description: string;
}

interface VideoCardProps {
  video: VideoData;
  onSelect: (video: VideoData) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  
  // Get or generate thumbnail URL
  useEffect(() => {
    const generateThumbnail = async () => {
      if (video.thumbnail) {
        setThumbnailUrl(video.thumbnail);
      } else {
        const generatedUrl = getYoutubeThumbnail(video.id);
        setThumbnailUrl(generatedUrl);
        
        // Cache the thumbnail for better performance
        if (generatedUrl) {
          try {
            // Create an updated video object with the thumbnail
            const updatedVideo = { ...video, thumbnail: generatedUrl };
            
            // Look for this video in the existing data
            const videosCacheString = localStorage.getItem('adminVideos');
            if (videosCacheString) {
              try {
                const videosCache = JSON.parse(videosCacheString);
                const updatedVideos = videosCache.map((v: VideoData) => 
                  v.id === video.id ? updatedVideo : v
                );
                
                // Save using the improved syncData function
                syncData('adminVideos', updatedVideos).catch(console.error);
              } catch (parseError) {
                console.error("Error parsing videos cache:", parseError);
              }
            }
          } catch (error) {
            console.error("Error caching thumbnail:", error);
          }
        }
      }
    };
    
    generateThumbnail();
  }, [video]);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const handleImageError = () => {
    setImageError(true);
    // If primary thumbnail fails, try direct YouTube API
    const fallbackThumbnail = getYoutubeThumbnail(video.id);
    if (thumbnailUrl !== fallbackThumbnail) {
      const img = new Image();
      img.onload = () => {
        setImageError(false);
        setImageLoaded(true);
        setThumbnailUrl(fallbackThumbnail);
      };
      img.onerror = () => {
        setImageError(true);
      };
      img.src = fallbackThumbnail;
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
      onClick={() => onSelect(video)}
    >
      <div className="aspect-video relative overflow-hidden">
        {!imageLoaded && !imageError && (
          <Skeleton className="absolute inset-0" />
        )}
        
        {thumbnailUrl && (
          <img 
            src={thumbnailUrl} 
            alt={video.title}
            className={`object-cover w-full h-full transition-transform hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        {imageError && (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <p className="text-sm text-gray-500">Thumbnail unavailable</p>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
          <span className="text-white text-sm font-medium">Watch Now</span>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium line-clamp-2 text-sm mb-1">{video.title}</h3>
        <p className="text-xs text-muted-foreground">{video.channelName}</p>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
