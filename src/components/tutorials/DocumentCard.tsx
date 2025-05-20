
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export interface DocumentData {
  id: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'ppt';
  fileUrl: string;
  uploadedAt: string;
  fileSize: string;
  category: string; // Added category field
}

interface DocumentCardProps {
  document: DocumentData;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-4 flex-1">
        <div className="flex items-center justify-center h-24 mb-4">
          <div className={`
            p-4 rounded-lg
            ${document.fileType === 'pdf' ? 'bg-red-100' : 'bg-blue-100'}
          `}>
            <FileText 
              size={48} 
              className={document.fileType === 'pdf' ? 'text-red-600' : 'text-blue-600'}
            />
          </div>
        </div>
        <h3 className="font-medium text-lg mb-2 line-clamp-2">{document.title}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{document.description}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{document.fileType.toUpperCase()}</span>
          <span>{document.fileSize}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full" variant="outline" asChild>
          <a href={document.fileUrl} target="_blank" rel="noreferrer">
            Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
