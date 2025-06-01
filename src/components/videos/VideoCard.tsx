
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  uploadedAt: string;
  channelName: string;
  isPremium?: boolean;
}

interface VideoCardProps {
  video: VideoData;
  onSelect: (video: VideoData) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onSelect }) => {
  const { isPremium } = useAuth();
  
  const canAccess = !video.isPremium || isPremium;

  const handleClick = () => {
    if (canAccess) {
      onSelect(video);
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md relative ${
        !canAccess ? 'opacity-75' : ''
      }`}
      onClick={handleClick}
    >
      {video.isPremium && (
        <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-50 z-10">
          Premium
        </Badge>
      )}
      
      <div className="relative">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-32 object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {canAccess ? (
            <div className="bg-black/50 rounded-full p-3">
              <Play className="h-6 w-6 text-white" fill="white" />
            </div>
          ) : (
            <div className="bg-black/50 rounded-full p-3">
              <Lock className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
          <Clock className="h-3 w-3 inline mr-1" />
          {video.duration}
        </div>
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h3>
        <p className="text-xs text-muted-foreground mb-2">{video.channelName}</p>
        <p className="text-xs text-muted-foreground">{video.uploadedAt}</p>
        {video.isPremium && !isPremium && (
          <p className="text-xs text-yellow-600 mt-1">Premium required</p>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoCard;
