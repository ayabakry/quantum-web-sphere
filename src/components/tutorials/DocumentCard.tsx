
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, FileArchive, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface DocumentData {
  id: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'ppt' | 'zip';
  fileUrl: string;
  uploadedAt: string;
  fileSize: string;
  category: string;
  isPremium?: boolean;
}

interface DocumentCardProps {
  document: DocumentData;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const { isPremium } = useAuth();
  
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText size={48} className="text-red-600" />;
      case 'ppt':
        return <FileText size={48} className="text-blue-600" />;
      case 'zip':
        return <FileArchive size={48} className="text-green-600" />;
      default:
        return <FileText size={48} className="text-gray-600" />;
    }
  };

  const getFileColor = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return 'bg-red-100';
      case 'ppt':
        return 'bg-blue-100';
      case 'zip':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  const canAccess = !document.isPremium || isPremium;

  return (
    <Card className="h-full flex flex-col relative">
      {document.isPremium && (
        <Badge className="absolute top-2 right-2 bg-yellow-500 text-yellow-50">
          Premium
        </Badge>
      )}
      
      <CardContent className="pt-4 flex-1">
        <div className="flex items-center justify-center h-24 mb-4">
          <div className={`p-4 rounded-lg ${getFileColor(document.fileType)} relative`}>
            {getFileIcon(document.fileType)}
            {document.isPremium && !isPremium && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <Lock className="h-6 w-6 text-white" />
              </div>
            )}
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
        {canAccess ? (
          <Button className="w-full" variant="outline" asChild>
            <a href={document.fileUrl} target="_blank" rel="noreferrer">
              Download
            </a>
          </Button>
        ) : (
          <Button className="w-full" variant="outline" disabled>
            Premium Required
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
