import React, { createContext, useContext, useState, useEffect } from 'react';
import { VideoData } from '@/components/videos/VideoCard';
import { DocumentData } from '@/components/tutorials/DocumentCard';
import { PatentData } from '@/components/patents/PatentCard';
import { Update } from '@/components/home/RecentUpdates';

interface SharedDataContextType {
  videos: VideoData[];
  documents: DocumentData[];
  patents: PatentData[];
  recentUpdates: Update[];
  setVideos: (videos: VideoData[]) => void;
  setDocuments: (documents: DocumentData[]) => void;
  setPatents: (patents: PatentData[]) => void;
  updateRecentUpdates: () => void;
}

const SharedDataContext = createContext<SharedDataContextType | undefined>(undefined);

export const useSharedData = () => {
  const context = useContext(SharedDataContext);
  if (!context) {
    throw new Error('useSharedData must be used within a SharedDataProvider');
  }
  return context;
};

export const SharedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [patents, setPatents] = useState<PatentData[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<Update[]>([]);

  // Load data from localStorage on initial load
  useEffect(() => {
    // Load videos
    const savedVideos = localStorage.getItem('adminVideos');
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    }

    // Load documents
    const savedDocuments = localStorage.getItem('adminDocuments');
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }

    // Load patents
    const savedPatents = localStorage.getItem('adminPatents');
    if (savedPatents) {
      setPatents(JSON.parse(savedPatents));
    }

    // Initial creation of recent updates
    updateRecentUpdates();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('adminVideos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('adminDocuments', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('adminPatents', JSON.stringify(patents));
  }, [patents]);

  useEffect(() => {
    if (recentUpdates.length > 0) {
      localStorage.setItem('recentUpdates', JSON.stringify(recentUpdates));
    }
  }, [recentUpdates]);

  // Function to update recent updates based on latest content
  const updateRecentUpdates = () => {
    // Create combined array of recent items
    const allUpdates: Update[] = [
      ...videos.map(video => ({
        id: parseInt(Date.now().toString() + Math.floor(Math.random() * 1000)),
        title: video.title,
        description: video.description.substring(0, 100) + (video.description.length > 100 ? '...' : ''),
        date: getRelativeTimeString(new Date(video.publishedAt)),
        type: 'video' as const,
      })),
      ...documents.map(doc => ({
        id: parseInt(Date.now().toString() + Math.floor(Math.random() * 1000)),
        title: doc.title,
        description: doc.description.substring(0, 100) + (doc.description.length > 100 ? '...' : ''),
        date: getRelativeTimeString(new Date(doc.uploadedAt)),
        type: 'tutorial' as const,
      })),
      ...patents.map(patent => ({
        id: parseInt(Date.now().toString() + Math.floor(Math.random() * 1000)),
        title: patent.title,
        description: patent.abstract.substring(0, 100) + (patent.abstract.length > 100 ? '...' : ''),
        date: getRelativeTimeString(new Date(patent.publicationDate)),
        type: 'patent' as const,
      })),
    ];

    // Sort by most recent first (assuming date is in a format that can be compared)
    allUpdates.sort((a, b) => {
      const dateA = parseRelativeDate(a.date);
      const dateB = parseRelativeDate(b.date);
      return dateA > dateB ? -1 : 1;
    });

    // Take the most recent 3 updates
    setRecentUpdates(allUpdates.slice(0, 3));
    localStorage.setItem('recentUpdates', JSON.stringify(allUpdates.slice(0, 3)));
  };

  // Helper to convert date to relative time
  const getRelativeTimeString = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    }
  };

  // Helper to parse relative date for sorting
  const parseRelativeDate = (relativeDate: string): number => {
    const now = new Date().getTime();
    
    if (relativeDate.includes('minutes')) {
      const minutes = parseInt(relativeDate);
      return now - (minutes * 60 * 1000);
    } else if (relativeDate.includes('hours')) {
      const hours = parseInt(relativeDate);
      return now - (hours * 60 * 60 * 1000);
    } else if (relativeDate.includes('days')) {
      const days = parseInt(relativeDate);
      return now - (days * 24 * 60 * 60 * 1000);
    } else if (relativeDate.includes('week')) {
      const weeks = parseInt(relativeDate);
      return now - (weeks * 7 * 24 * 60 * 60 * 1000);
    } else if (relativeDate.includes('month')) {
      const months = parseInt(relativeDate);
      return now - (months * 30 * 24 * 60 * 60 * 1000);
    }
    
    return now;
  };

  return (
    <SharedDataContext.Provider
      value={{
        videos,
        documents,
        patents,
        recentUpdates,
        setVideos,
        setDocuments,
        setPatents,
        updateRecentUpdates,
      }}
    >
      {children}
    </SharedDataContext.Provider>
  );
};
