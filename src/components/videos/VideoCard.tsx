
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getYoutubeThumbnail } from '@/lib/utils';

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
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
      onClick={() => onSelect(video)}
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={video.thumbnail || getYoutubeThumbnail(video.id)} 
          alt={video.title}
          className="object-cover w-full h-full transition-transform hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getYoutubeThumbnail(video.id);
          }}
        />
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
