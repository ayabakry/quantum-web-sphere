
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSharedData } from '@/context/SharedDataContext';
import { Skeleton } from '@/components/ui/skeleton';
import { loadData } from '@/lib/utils';

export type Update = {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'video' | 'tutorial' | 'patent';
};

const RecentUpdates: React.FC = () => {
  const { recentUpdates, loading } = useSharedData();
  const [displayUpdates, setDisplayUpdates] = useState<Update[]>([]);

  // Try to load updates directly for faster rendering
  useEffect(() => {
    const loadInitialUpdates = async () => {
      try {
        const cachedUpdates = await loadData('recentUpdates', []);
        if (cachedUpdates && cachedUpdates.length > 0) {
          setDisplayUpdates(cachedUpdates);
        }
      } catch (error) {
        console.error("Error loading cached updates:", error);
      }
    };
    
    loadInitialUpdates();
  }, []);

  // Update from context when available
  useEffect(() => {
    if (recentUpdates && recentUpdates.length > 0) {
      setDisplayUpdates(recentUpdates);
    }
  }, [recentUpdates]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-start space-x-4 pb-4 border-b">
        <div className="w-full">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <div className="flex items-start space-x-4 pb-4 border-b">
        <div className="w-full">
          <Skeleton className="h-5 w-2/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <div className="flex items-start space-x-4 pb-4">
        <div className="w-full">
          <Skeleton className="h-5 w-3/5 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );

  const showLoading = loading && displayUpdates.length === 0;

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Recent Updates</CardTitle>
        <CardDescription>Latest content added to QRAM</CardDescription>
      </CardHeader>
      <CardContent>
        {showLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-4">
            {displayUpdates.map((update) => (
              <div key={update.id} className="flex items-start space-x-4 pb-4 border-b last:border-0">
                <div className="w-full">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{update.title}</h4>
                    <div className={`
                      inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                      ${update.type === 'video' ? 'bg-red-100 text-red-800' : ''}
                      ${update.type === 'tutorial' ? 'bg-blue-100 text-blue-800' : ''}
                      ${update.type === 'patent' ? 'bg-green-100 text-green-800' : ''}
                    `}>
                      {update.type}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{update.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{update.date}</p>
                </div>
              </div>
            ))}
            {displayUpdates.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No recent updates</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentUpdates;
