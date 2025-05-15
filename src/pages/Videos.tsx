
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import VideoCard, { VideoData } from '@/components/videos/VideoCard';
import VideoPlayer from '@/components/videos/VideoPlayer';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useSharedData } from '@/context/SharedDataContext';
import { Skeleton } from '@/components/ui/skeleton';

const Videos = () => {
  const { videos, loading } = useSharedData();
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayVideos, setDisplayVideos] = useState<VideoData[]>([]);

  useEffect(() => {
    if (videos.length > 0) {
      setDisplayVideos(videos);
      
      // If we have videos and none selected yet, select the first one
      if (!selectedVideo && videos.length > 0) {
        setSelectedVideo(videos[0]);
      }
    }
  }, [videos, selectedVideo]);

  const filteredVideos = displayVideos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.channelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  );

  return (
    <MainLayout>
      <div className="container px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8">Video Library</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <VideoPlayer video={selectedVideo} />
          </div>
          
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-medium">Video List</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {loading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  {filteredVideos.map((video) => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      onSelect={setSelectedVideo} 
                    />
                  ))}
                  {filteredVideos.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No videos found</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Videos;
