
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import VideoCard, { VideoData } from '@/components/videos/VideoCard';
import VideoPlayer from '@/components/videos/VideoPlayer';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Mock data for videos
const mockVideos: VideoData[] = [
  {
    id: 'https://www.youtube.com/watch?v=JhHMJCUmq28',
    title: 'Quantum Computing Explained',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60',
    channelName: 'Quantum Research Channel',
    publishedAt: 'May 10, 2023',
    description: 'An introduction to quantum computing concepts and their applications in solving complex problems.',
  },
  {
    id: 'https://www.youtube.com/watch?v=S4xALqDU1Eo',
    title: 'Introduction to Quantum Mechanics',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=60',
    channelName: 'Physics Explained',
    publishedAt: 'June 22, 2023',
    description: 'This video provides a comprehensive overview of quantum mechanics and its fundamental principles.',
  },
  {
    id: 'https://www.youtube.com/watch?v=e8yvJqxHswc',
    title: 'Quantum Algorithms: A Deep Dive',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=60',
    channelName: 'Quantum Research Channel',
    publishedAt: 'August 5, 2023',
    description: 'Explore the most important quantum algorithms and how they provide computational advantages over classical algorithms.',
  },
  {
    id: 'https://www.youtube.com/watch?v=wQskz_iB-20',
    title: 'Quantum Error Correction',
    thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=60',
    channelName: 'Quantum Computing Weekly',
    publishedAt: 'September 12, 2023',
    description: 'Learn about techniques used to protect quantum information from errors due to decoherence and other quantum noise.',
  },
  {
    id: 'https://www.youtube.com/watch?v=OWJCfOvochA',
    title: 'Quantum Entanglement Explained',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=60',
    channelName: 'Physics Explained',
    publishedAt: 'October 3, 2023',
    description: 'Understanding quantum entanglement and its implications for quantum information processing.',
  },
  {
    id: 'https://www.youtube.com/watch?v=ZoT82NDpcvQ',
    title: 'Quantum Computing Applications',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=60',
    channelName: 'Tech Insights',
    publishedAt: 'November 18, 2023',
    description: 'Discover real-world applications of quantum computing in various industries including finance, healthcare, and cryptography.',
  },
];

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = mockVideos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.channelName.toLowerCase().includes(searchQuery.toLowerCase())
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
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Videos;
