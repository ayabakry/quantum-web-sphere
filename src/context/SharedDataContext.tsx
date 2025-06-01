
import React, { createContext, useContext, useState, useEffect } from 'react';
import { VideoData } from '@/components/videos/VideoCard';
import { DocumentData } from '@/components/tutorials/DocumentCard';
import { PatentData } from '@/components/patents/PatentCard';

interface RecentUpdate {
  id: string;
  type: 'video' | 'document' | 'patent';
  title: string;
  date: string;
}

interface SharedDataContextType {
  videos: VideoData[];
  documents: DocumentData[];
  patents: PatentData[];
  recentUpdates: RecentUpdate[];
  loading: boolean;
  setVideos: (videos: VideoData[]) => void;
  setDocuments: (documents: DocumentData[]) => void;
  setPatents: (patents: PatentData[]) => void;
  updateRecentUpdates: () => void;
}

const SharedDataContext = createContext<SharedDataContextType | undefined>(undefined);

export const SharedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [patents, setPatents] = useState<PatentData[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<RecentUpdate[]>([]);

  // Initialize with sample data
  useEffect(() => {
    const initializeData = () => {
      const sampleVideos: VideoData[] = [
        {
          id: '1',
          title: 'Introduction to Quantum Computing',
          description: 'A comprehensive introduction to quantum computing principles and applications.',
          thumbnailUrl: '/placeholder.svg',
          videoUrl: 'https://example.com/video1.mp4',
          duration: '45:30',
          uploadedAt: '2024-01-15',
          channelName: 'Quantum Academy',
          isPremium: false
        },
        {
          id: '2',
          title: 'Advanced Quantum Algorithms',
          description: 'Deep dive into Shor\'s algorithm, Grover\'s algorithm, and other quantum algorithms.',
          thumbnailUrl: '/placeholder.svg',
          videoUrl: 'https://example.com/video2.mp4',
          duration: '62:15',
          uploadedAt: '2024-01-20',
          channelName: 'Quantum Research Lab',
          isPremium: true
        },
        {
          id: '3',
          title: 'Quantum Error Correction',
          description: 'Understanding quantum error correction codes and fault-tolerant quantum computing.',
          thumbnailUrl: '/placeholder.svg',
          videoUrl: 'https://example.com/video3.mp4',
          duration: '38:45',
          uploadedAt: '2024-01-25',
          channelName: 'Quantum Academy',
          isPremium: true
        }
      ];

      const sampleDocuments: DocumentData[] = [
        {
          id: '1',
          title: 'Quantum Computing Fundamentals',
          description: 'A beginner-friendly guide to quantum computing concepts.',
          fileType: 'pdf',
          fileUrl: 'https://example.com/quantum-fundamentals.pdf',
          uploadedAt: '2024-01-10',
          fileSize: '2.4 MB',
          category: 'Getting Started',
          isPremium: false
        },
        {
          id: '2',
          title: 'Advanced Quantum Mechanics',
          description: 'In-depth exploration of quantum mechanical principles.',
          fileType: 'pdf',
          fileUrl: 'https://example.com/advanced-quantum.pdf',
          uploadedAt: '2024-01-12',
          fileSize: '5.8 MB',
          category: 'Advanced Techniques',
          isPremium: true
        },
        {
          id: '3',
          title: 'Quantum Algorithm Implementation',
          description: 'Practical guide to implementing quantum algorithms.',
          fileType: 'ppt',
          fileUrl: 'https://example.com/quantum-algorithms.pptx',
          uploadedAt: '2024-01-18',
          fileSize: '12.3 MB',
          category: 'Quantum Computing',
          isPremium: true
        },
        {
          id: '4',
          title: 'Research Methodology Guide',
          description: 'Best practices for quantum computing research.',
          fileType: 'zip',
          fileUrl: 'https://example.com/research-guide.zip',
          uploadedAt: '2024-01-22',
          fileSize: '8.7 MB',
          category: 'Research Methods',
          isPremium: false
        }
      ];

      const samplePatents: PatentData[] = [
        {
          id: '1',
          title: 'Quantum Error Correction System',
          abstract: 'A novel approach to quantum error correction using topological qubits.',
          inventors: ['Dr. Alice Johnson', 'Dr. Bob Smith'],
          filingDate: '2023-06-15',
          publicationDate: '2023-12-15',
          patentNumber: 'US11234567B2',
          status: 'granted',
          isPremium: false
        },
        {
          id: '2',
          title: 'Quantum Cryptography Protocol',
          abstract: 'Advanced quantum key distribution protocol for secure communications.',
          inventors: ['Dr. Carol Wilson', 'Dr. David Brown'],
          filingDate: '2023-08-20',
          publicationDate: '2024-02-20',
          patentNumber: 'US11345678B2',
          status: 'pending',
          isPremium: true
        },
        {
          id: '3',
          title: 'Quantum Computing Architecture',
          abstract: 'Scalable quantum computing architecture for fault-tolerant operations.',
          inventors: ['Dr. Eve Davis', 'Dr. Frank Miller'],
          filingDate: '2023-09-10',
          publicationDate: '2024-03-10',
          patentNumber: 'US11456789B2',
          status: 'granted',
          isPremium: true
        }
      ];

      setVideos(sampleVideos);
      setDocuments(sampleDocuments);
      setPatents(samplePatents);
      setLoading(false);
      updateRecentUpdatesFromData(sampleVideos, sampleDocuments, samplePatents);
    };

    // Simulate loading delay
    const timer = setTimeout(initializeData, 1000);
    return () => clearTimeout(timer);
  }, []);

  const updateRecentUpdatesFromData = (videoData: VideoData[], documentData: DocumentData[], patentData: PatentData[]) => {
    const allUpdates: RecentUpdate[] = [
      ...videoData.map(video => ({
        id: `video-${video.id}`,
        type: 'video' as const,
        title: video.title,
        date: video.uploadedAt
      })),
      ...documentData.map(doc => ({
        id: `document-${doc.id}`,
        type: 'document' as const,
        title: doc.title,
        date: doc.uploadedAt
      })),
      ...patentData.map(patent => ({
        id: `patent-${patent.id}`,
        type: 'patent' as const,
        title: patent.title,
        date: patent.publicationDate
      }))
    ];

    // Sort by date and take the 5 most recent
    const sortedUpdates = allUpdates
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    setRecentUpdates(sortedUpdates);
  };

  const updateRecentUpdates = () => {
    updateRecentUpdatesFromData(videos, documents, patents);
  };

  const value: SharedDataContextType = {
    videos,
    documents,
    patents,
    recentUpdates,
    loading,
    setVideos: (newVideos) => {
      setVideos(newVideos);
      updateRecentUpdatesFromData(newVideos, documents, patents);
    },
    setDocuments: (newDocuments) => {
      setDocuments(newDocuments);
      updateRecentUpdatesFromData(videos, newDocuments, patents);
    },
    setPatents: (newPatents) => {
      setPatents(newPatents);
      updateRecentUpdatesFromData(videos, documents, newPatents);
    },
    updateRecentUpdates
  };

  return (
    <SharedDataContext.Provider value={value}>
      {children}
    </SharedDataContext.Provider>
  );
};

export const useSharedData = () => {
  const context = useContext(SharedDataContext);
  if (context === undefined) {
    throw new Error('useSharedData must be used within a SharedDataProvider');
  }
  return context;
};
