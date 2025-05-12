
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import ContentTable from '@/components/admin/ContentTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentData } from '@/components/tutorials/DocumentCard';

// Get initial documents from localStorage or use default data
const getInitialDocuments = (): DocumentData[] => {
  const savedDocuments = localStorage.getItem('adminDocuments');
  if (savedDocuments) {
    return JSON.parse(savedDocuments);
  }

  // Default initial documents
  return [
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
  ];
};

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'fileType', label: 'File Type' },
  { key: 'uploadedAt', label: 'Upload Date' },
  { key: 'fileSize', label: 'File Size' },
];

const AdminTutorials = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentData[]>(getInitialDocuments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<DocumentData>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('adminDocuments', JSON.stringify(documents));
  }, [documents]);

  const handleAddDocument = () => {
    setFormData({ fileType: 'pdf' });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleEditDocument = (id: string) => {
    const documentToEdit = documents.find(d => d.id === id);
    if (documentToEdit) {
      setFormData({ ...documentToEdit });
      setEditingId(id);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteDocument = (id: string) => {
    const updatedDocuments = documents.filter(d => d.id !== id);
    setDocuments(updatedDocuments);
    toast({
      title: "Document deleted",
      description: "The document has been removed successfully",
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing document
      const updatedDocuments = documents.map(d => 
        d.id === editingId ? { ...d, ...formData } as DocumentData : d
      );
      setDocuments(updatedDocuments);
      
      toast({
        title: "Document updated",
        description: "The document has been updated successfully",
      });
    } else {
      // Add new document
      const newDocument = {
        ...formData,
        id: String(Date.now()),
        uploadedAt: new Date().toISOString().split('T')[0],
      } as DocumentData;
      
      setDocuments([...documents, newDocument]);
      toast({
        title: "Document added",
        description: "The new document has been added successfully",
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Tutorials</h1>
        <Button onClick={handleAddDocument}>
          <Plus className="h-4 w-4 mr-2" /> Add Document
        </Button>
      </div>
      
      <ContentTable
        columns={columns}
        data={documents}
        onEdit={handleEditDocument}
        onDelete={handleDeleteDocument}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Document' : 'Add New Document'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update the document details below'
                : 'Enter the details for the new document'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fileType">File Type</Label>
              <Select
                value={formData.fileType}
                onValueChange={(value) => handleSelectChange('fileType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="ppt">PPT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fileUrl">File URL</Label>
              <Input
                id="fileUrl"
                name="fileUrl"
                value={formData.fileUrl || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/document.pdf"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fileSize">File Size</Label>
              <Input
                id="fileSize"
                name="fileSize"
                value={formData.fileSize || ''}
                onChange={handleInputChange}
                placeholder="e.g. 2.4 MB"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Update Document' : 'Add Document'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTutorials;
