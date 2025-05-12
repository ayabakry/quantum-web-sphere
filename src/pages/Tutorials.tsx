
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import DocumentCard, { DocumentData } from '@/components/tutorials/DocumentCard';
import { Input } from '@/components/ui/input';
import { Search, FileText, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for documents
const mockDocuments: DocumentData[] = [
  {
    id: '1',
    title: 'Introduction to Quantum Computing',
    description: 'A comprehensive guide to quantum computing basics and core concepts',
    fileType: 'pdf',
    fileUrl: '#',
    uploadedAt: '2023-06-15',
    fileSize: '2.4 MB',
  },
  {
    id: '2',
    title: 'Quantum Algorithms Overview',
    description: 'Presentation slides on popular quantum algorithms and their applications',
    fileType: 'ppt',
    fileUrl: '#',
    uploadedAt: '2023-07-22',
    fileSize: '5.1 MB',
  },
  {
    id: '3',
    title: 'Quantum Error Correction Methods',
    description: 'Detailed analysis of quantum error correction techniques',
    fileType: 'pdf',
    fileUrl: '#',
    uploadedAt: '2023-08-10',
    fileSize: '3.7 MB',
  },
  {
    id: '4',
    title: 'Quantum Hardware Architecture',
    description: 'Presentation on different quantum hardware implementations and their pros/cons',
    fileType: 'ppt',
    fileUrl: '#',
    uploadedAt: '2023-09-05',
    fileSize: '8.2 MB',
  },
  {
    id: '5',
    title: 'Quantum Programming Languages',
    description: 'Guide to quantum programming languages and frameworks',
    fileType: 'pdf',
    fileUrl: '#',
    uploadedAt: '2023-10-18',
    fileSize: '4.5 MB',
  },
  {
    id: '6',
    title: 'Quantum Machine Learning',
    description: 'Introduction to quantum approaches for machine learning algorithms',
    fileType: 'pdf',
    fileUrl: '#',
    uploadedAt: '2023-11-22',
    fileSize: '6.3 MB',
  },
];

const Tutorials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredDocuments = mockDocuments
    .filter(doc => 
      (activeTab === 'all' || doc.fileType === activeTab) &&
      (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <MainLayout>
      <div className="container px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8">Tutorials & Resources</h1>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
              <TabsTrigger value="ppt">PPT</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
          
          {filteredDocuments.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium">No documents found</h2>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search query or filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Tutorials;
