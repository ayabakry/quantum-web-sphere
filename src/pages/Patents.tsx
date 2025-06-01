import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import ProtectedContent from '@/components/auth/ProtectedContent';
import PatentCard, { PatentData } from '@/components/patents/PatentCard';
import { useSharedData } from '@/context/SharedDataContext';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

const Patents = () => {
  const { patents, loading } = useSharedData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [displayPatents, setDisplayPatents] = useState<PatentData[]>([]);

  useEffect(() => {
    if (patents.length > 0) {
      setDisplayPatents(patents);
    }
  }, [patents]);

  // Filter patents based on search query and status filter
  const filteredPatents = displayPatents.filter(patent => {
    const matchesSearch = 
      patent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patent.patentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patent.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || patent.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Skeleton className="h-[300px] w-full" />
      <Skeleton className="h-[300px] w-full" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  );

  return (
    <MainLayout>
      <ProtectedContent>
        <div className="container px-4 py-8 md:py-12">
          <h1 className="text-3xl font-bold mb-8">Patent Database</h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patents..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-48">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="granted">Granted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {loading ? (
            <LoadingSkeleton />
          ) : filteredPatents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No patents found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatents.map((patent) => (
                <PatentCard key={patent.id} patent={patent} />
              ))}
            </div>
          )}
        </div>
      </ProtectedContent>
    </MainLayout>
  );
};

export default Patents;
