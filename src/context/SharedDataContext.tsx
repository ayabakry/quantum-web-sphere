
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VideoData } from '@/components/videos/VideoCard';
import { DocumentData } from '@/components/tutorials/DocumentCard';
import { PatentData } from '@/components/patents/PatentCard';
import { Update } from '@/components/home/RecentUpdates';
import { syncData, loadData, checkForUpdates } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface SharedDataContextType {
  videos: VideoData[];
  documents: DocumentData[];
  patents: PatentData[];
  recentUpdates: Update[];
  setVideos: (videos: VideoData[]) => void;
  setDocuments: (documents: DocumentData[]) => void;
  setPatents: (patents: PatentData[]) => void;
  updateRecentUpdates: () => void;
  loading: boolean;
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
  const [videos, setVideosState] = useState<VideoData[]>([]);
  const [documents, setDocumentsState] = useState<DocumentData[]>([]);
  const [patents, setPatentsState] = useState<PatentData[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data on initial load
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Load videos
        const videosData = await loadData('adminVideos', []);
        setVideosState(videosData);
        
        // Load documents
        const documentsData = await loadData('adminDocuments', []);
        setDocumentsState(documentsData);
        
        // Load patents
        const patentsData = await loadData('adminPatents', []);
        setPatentsState(patentsData);
        
        // Load recent updates
        const updatesData = await loadData('recentUpdates', []);
        if (updatesData && updatesData.length > 0) {
          setRecentUpdates(updatesData);
        } else {
          // Generate updates if none exist
          updateRecentUpdatesFromData(videosData, documentsData, patentsData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load data. Please try refreshing the page.",
          variant: "destructive"
        });
      }
    };

    fetchAllData();

    // Setup periodic data refresh to check for updates from other devices
    const refreshInterval = setInterval(async () => {
      try {
        // Check for updated data from other devices/browsers
        const hasVideoUpdates = await checkForUpdates('adminVideos');
        if (hasVideoUpdates) {
          const videosData = await loadData('adminVideos', []);
          if (videosData && videosData.length > 0) {
            setVideosState(videosData);
          }
        }
        
        const hasDocumentUpdates = await checkForUpdates('adminDocuments');
        if (hasDocumentUpdates) {
          const documentsData = await loadData('adminDocuments', []);
          if (documentsData && documentsData.length > 0) {
            setDocumentsState(documentsData);
          }
        }
        
        const hasPatentUpdates = await checkForUpdates('adminPatents');
        if (hasPatentUpdates) {
          const patentsData = await loadData('adminPatents', []);
          if (patentsData && patentsData.length > 0) {
            setPatentsState(patentsData);
          }
        }
        
        const hasUpdateUpdates = await checkForUpdates('recentUpdates');
        if (hasUpdateUpdates) {
          const updatesData = await loadData('recentUpdates', []);
          if (updatesData && updatesData.length > 0) {
            setRecentUpdates(updatesData);
          }
        }
      } catch (error) {
        console.error("Error refreshing data:", error);
      }
    }, 10000); // Check every 10 seconds
    
    // Listen for storage events from other tabs/windows
    const handleStorageEvent = (event: StorageEvent | CustomEvent) => {
      if (event instanceof StorageEvent) {
        const keyCheck = (eventKey: string | null, dataKey: string) => 
          eventKey === dataKey || eventKey === `cloud_${dataKey}`;
        
        if (event.key && keyCheck(event.key, 'adminVideos')) {
          loadData('adminVideos', []).then(setVideosState);
        } else if (event.key && keyCheck(event.key, 'adminDocuments')) {
          loadData('adminDocuments', []).then(setDocumentsState);
        } else if (event.key && keyCheck(event.key, 'adminPatents')) {
          loadData('adminPatents', []).then(setPatentsState);
        } else if (event.key && keyCheck(event.key, 'recentUpdates')) {
          loadData('recentUpdates', []).then(setRecentUpdates);
        }
      } else if (event instanceof CustomEvent && event.type === 'lovableStorage') {
        const { key, data } = event.detail;
        if (key === 'adminVideos') {
          setVideosState(data);
        } else if (key === 'adminDocuments') {
          setDocumentsState(data);
        } else if (key === 'adminPatents') {
          setPatentsState(data);
        } else if (key === 'recentUpdates') {
          setRecentUpdates(data);
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('lovableStorage', handleStorageEvent as EventListener);
    
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('lovableStorage', handleStorageEvent as EventListener);
    };
  }, []);

  const setVideos = async (newVideos: VideoData[]) => {
    setVideosState(newVideos);
    await syncData('adminVideos', newVideos);
    toast({
      title: "Videos Saved",
      description: "Your videos have been saved and will be available across devices.",
    });
  };

  const setDocuments = async (newDocuments: DocumentData[]) => {
    setDocumentsState(newDocuments);
    await syncData('adminDocuments', newDocuments);
    toast({
      title: "Documents Saved",
      description: "Your documents have been saved and will be available across devices.",
    });
  };

  const setPatents = async (newPatents: PatentData[]) => {
    setPatentsState(newPatents);
    await syncData('adminPatents', newPatents);
    toast({
      title: "Patents Saved",
      description: "Your patents have been saved and will be available across devices.",
    });
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

  // Function to create updates from the available data
  const updateRecentUpdatesFromData = (
    videosData: VideoData[] = videos,
    documentsData: DocumentData[] = documents,
    patentsData: PatentData[] = patents
  ) => {
    // Create combined array of recent items
    const allUpdates: Update[] = [
      ...videosData.map(video => ({
        id: parseInt(Date.now().toString() + Math.floor(Math.random() * 1000)),
        title: video.title,
        description: video.description.substring(0, 100) + (video.description.length > 100 ? '...' : ''),
        date: getRelativeTimeString(new Date(video.publishedAt)),
        type: 'video' as const,
      })),
      ...documentsData.map(doc => ({
        id: parseInt(Date.now().toString() + Math.floor(Math.random() * 1000)),
        title: doc.title,
        description: doc.description.substring(0, 100) + (doc.description.length > 100 ? '...' : ''),
        date: getRelativeTimeString(new Date(doc.uploadedAt)),
        type: 'tutorial' as const,
      })),
      ...patentsData.map(patent => ({
        id: parseInt(Date.now().toString() + Math.floor(Math.random() * 1000)),
        title: patent.title,
        description: patent.abstract.substring(0, 100) + (patent.abstract.length > 100 ? '...' : ''),
        date: getRelativeTimeString(new Date(patent.publicationDate)),
        type: 'patent' as const,
      })),
    ];

    // Sort by most recent first
    allUpdates.sort((a, b) => {
      const dateA = parseRelativeDate(a.date);
      const dateB = parseRelativeDate(b.date);
      return dateA > dateB ? -1 : 1;
    });

    // Take the most recent 3 updates
    const latestUpdates = allUpdates.slice(0, 3);
    setRecentUpdates(latestUpdates);
    syncData('recentUpdates', latestUpdates).catch(console.error);
  };

  // Public method to update recent updates
  const updateRecentUpdates = () => {
    updateRecentUpdatesFromData();
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
        loading
      }}
    >
      {children}
    </SharedDataContext.Provider>
  );
};
