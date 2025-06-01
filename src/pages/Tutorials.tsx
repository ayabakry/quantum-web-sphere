
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import DocumentCard, { DocumentData } from '@/components/tutorials/DocumentCard';
import ProtectedContent from '@/components/auth/ProtectedContent';
import { useSharedData } from '@/context/SharedDataContext';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Tutorials = () => {
  const { documents, loading } = useSharedData();
  const [searchQuery, setSearchQuery] = useState('');
  const [displayDocuments, setDisplayDocuments] = useState<DocumentData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

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
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDocumentsByCategory = (category: string) => {
    return filteredDocuments.filter(doc => doc.category === category);
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  );

  return (
    <MainLayout>
      <ProtectedContent>
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
          ) : (
            <>
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No documents found</p>
                </div>
              ) : (
                <Tabs defaultValue={categories[0] || 'all'} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    {categories.map((category) => (
                      <TabsTrigger key={category} value={category} className="text-xs">
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {categories.map((category) => (
                    <TabsContent key={category} value={category} className="mt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {getDocumentsByCategory(category).map((doc) => (
                          <DocumentCard key={doc.id} document={doc} />
                        ))}
                      </div>
                      {getDocumentsByCategory(category).length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No documents in this category</p>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </>
          )}
        </div>
      </ProtectedContent>
    </MainLayout>
  );
};

export default Tutorials;
