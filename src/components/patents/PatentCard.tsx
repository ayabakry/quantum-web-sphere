
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface PatentData {
  id: string;
  title: string;
  abstract: string;
  inventors: string[];
  filingDate: string;
  publicationDate: string;
  patentNumber: string;
  status: 'pending' | 'granted' | 'rejected';
  isPremium?: boolean;
}

interface PatentCardProps {
  patent: PatentData;
}

const PatentCard: React.FC<PatentCardProps> = ({ patent }) => {
  const { isPremium } = useAuth();
  
  const canAccess = !patent.isPremium || isPremium;

  return (
    <Card className="h-full flex flex-col relative">
      {patent.isPremium && (
        <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-50">
          Premium
        </Badge>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium">{patent.title}</h3>
          <div className={`
            inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
            ${patent.status === 'granted' ? 'bg-green-100 text-green-800' : ''}
            ${patent.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${patent.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
          `}>
            {patent.status}
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-1">
        <p className="text-sm text-muted-foreground mb-4">
          {canAccess ? patent.abstract : "This content is only available for premium subscribers."}
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Patent Number:</span>
            <span className="font-medium">{canAccess ? patent.patentNumber : "***"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Filing Date:</span>
            <span className="font-medium">{patent.filingDate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Publication Date:</span>
            <span className="font-medium">{patent.publicationDate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Inventors:</span>
            <span className="font-medium">
              {canAccess ? patent.inventors.join(', ') : "Premium required"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {canAccess ? (
          <Button size="sm" variant="outline" className="w-full">
            <Database className="h-4 w-4 mr-2" /> View Details
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="w-full" disabled>
            <Lock className="h-4 w-4 mr-2" /> Premium Required
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PatentCard;
