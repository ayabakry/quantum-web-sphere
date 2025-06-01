
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import DocumentCard, { DocumentData } from '@/components/tutorials/DocumentCard';
import ProtectedContent from '@/components/auth/ProtectedContent';
import { useSharedData } from '@/context/SharedDataContext';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Tutorials = () => {
  const { documents, loading } = useSharedData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  const filteredDocuments = displayDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery || selectedCategory !== 'all' 
                      ? 'No documents found matching your criteria' 
                      : 'No documents found'
                    }
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
                      {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredDocuments.map((doc) => (
                      <DocumentCard key={doc.id} document={doc} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </ProtectedContent>
    </MainLayout>
  );
};

export default Tutorials;
