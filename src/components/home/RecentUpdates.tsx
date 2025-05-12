
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Update = {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'video' | 'tutorial' | 'patent';
};

const recentUpdates: Update[] = [
  {
    id: 1,
    title: 'Quantum Computing Basics',
    description: 'New introductory video on quantum computing fundamentals',
    date: '2 days ago',
    type: 'video',
  },
  {
    id: 2,
    title: 'Quantum Algorithms PDF',
    description: 'Tutorial on implementing Shor\'s algorithm',
    date: '1 week ago',
    type: 'tutorial',
  },
  {
    id: 3,
    title: 'Quantum Error Correction',
    description: 'New patent filed for error correction in quantum circuits',
    date: '2 weeks ago',
    type: 'patent',
  },
];

const RecentUpdates: React.FC = () => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Recent Updates</CardTitle>
        <CardDescription>Latest content added to QRAM</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentUpdates.map((update) => (
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
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentUpdates;
