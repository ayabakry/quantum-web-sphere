
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import PatentCard, { PatentData } from '@/components/patents/PatentCard';
import { Input } from '@/components/ui/input';
import { Search, Database } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for patents
const mockPatents: PatentData[] = [
  {
    id: '1',
    title: 'Quantum Circuit Optimization Method',
    abstract: 'A novel method for optimizing quantum circuits to reduce gate count and improve coherence time',
    inventors: ['Alice Johnson', 'Robert Chen'],
    filingDate: '2022-03-15',
    publicationDate: '2023-09-22',
    patentNumber: 'US10234567',
    status: 'granted',
  },
  {
    id: '2',
    title: 'Error-Resistant Quantum Memory',
    abstract: 'A system for storing quantum information with enhanced protection against decoherence',
    inventors: ['Sarah Williams', 'James Lee'],
    filingDate: '2022-05-10',
    publicationDate: '2023-11-05',
    patentNumber: 'US10345678',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Quantum Network Protocol',
    abstract: 'Secure communication protocol utilizing entanglement for quantum networks',
    inventors: ['Michael Brown', 'Lisa Chen'],
    filingDate: '2021-11-28',
    publicationDate: '2023-05-14',
    patentNumber: 'US10456789',
    status: 'granted',
  },
  {
    id: '4',
    title: 'Quantum Algorithm for Drug Discovery',
    abstract: 'Computational method using quantum computers to accelerate the discovery of pharmaceutical compounds',
    inventors: ['David Miller', 'Elena Rodriguez'],
    filingDate: '2022-08-03',
    publicationDate: '2023-12-20',
    patentNumber: 'US10567890',
    status: 'pending',
  },
  {
    id: '5',
    title: 'Scalable Quantum Processor Architecture',
    abstract: 'A modular and scalable architecture for quantum processors with improved error rates',
    inventors: ['John Smith', 'Wei Zhang', 'Anna Lee'],
    filingDate: '2021-09-15',
    publicationDate: '2023-03-10',
    patentNumber: 'US10678901',
    status: 'granted',
  },
  {
    id: '6',
    title: 'Quantum Machine Learning Method',
    abstract: 'Method for implementing neural networks on quantum hardware for improved performance',
    inventors: ['Thomas Wilson', 'Samantha Park'],
    filingDate: '2022-06-22',
    publicationDate: '2023-12-18',
    patentNumber: 'US10789012',
    status: 'pending',
  },
];

const Patents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredPatents = mockPatents.filter(patent => 
    (statusFilter === 'all' || patent.status === statusFilter) &&
    (patent.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     patent.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
     patent.patentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
     patent.inventors.some(inventor => inventor.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <MainLayout>
      <div className="container px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8">Patent Database</h1>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="granted">Granted</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatents.map((patent) => (
            <PatentCard key={patent.id} patent={patent} />
          ))}
          
          {filteredPatents.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium">No patents found</h2>
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

export default Patents;
