
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import DocumentCard, { DocumentData } from '@/components/tutorials/DocumentCard';
import { useSharedData } from '@/context/SharedDataContext';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Tutorials = () => {
  const { documents, loading } = useSharedData();
  const [searchQuery, setSearchQuery] = useState('');
  const [displayDocuments, setDisplayDocuments] = useState<DocumentData[]>([]);

  useEffect(() => {
    if (documents.length > 0) {
      setDisplayDocuments(documents);
    }
  }, [documents]);

  const filteredDocuments = displayDocuments.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter documents by type
  const pdfDocuments = filteredDocuments.filter(doc => doc.fileType === 'pdf');
  const pptDocuments = filteredDocuments.filter(doc => doc.fileType === 'ppt');

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  );

  return (
    <MainLayout>
      <div className="container px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8">Tutorial Documents</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {loading ? (
          <LoadingSkeleton />
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No documents found</p>
          </div>
        ) : (
          <>
            {/* PDF Documents */}
            {pdfDocuments.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4">PDF Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pdfDocuments.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              </div>
            )}
            
            {/* PPT Documents */}
            {pptDocuments.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Presentations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pptDocuments.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Tutorials;
