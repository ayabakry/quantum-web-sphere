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
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    if (documents.length > 0) {
      setDisplayDocuments(documents);

      const uniqueCategories = Array.from(
        new Set(documents.map(doc => doc.category || 'Uncategorized'))
      );
      setCategories(uniqueCategories);
    }
  }, [documents]);

  const filteredDocuments = displayDocuments.filter(doc =>
    (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (activeCategory === 'all' || doc.category === activeCategory)
  );

  const pdfDocuments = filteredDocuments.filter(doc => doc.fileType === 'pdf');
  const pptDocuments = filteredDocuments.filter(doc => doc.fileType === 'ppt');

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

        {/* Category dropdown filter */}
        <div className="mb-6 w-full md:w-1/3">
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            <option value="all">All Documents</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No documents found</p>
              </div>
            ) : (
              <>
                {pdfDocuments.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-xl font-bold mb-4">PDF Documents</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {pdfDocuments.map((doc) => (
                        <DocumentCard key={doc.id} document={doc} />
                      ))}
                    </div>
                  </div>
                )}

                {pptDocuments.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Presentations</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {pptDocuments.map((doc) => (
                        <DocumentCard key={doc.id} document={doc} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Tutorials;
