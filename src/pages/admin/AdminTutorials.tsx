
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
import { useSharedData } from '@/context/SharedDataContext';

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'fileType', label: 'File Type' },
  { key: 'uploadedAt', label: 'Upload Date' },
  { key: 'fileSize', label: 'File Size' },
];

// Predefined categories
const CATEGORIES = [
  'Getting Started',
  'Advanced Techniques',
  'Quantum Computing',
  'Research Methods',
  'Case Studies',
  'Reference Materials',
];

const AdminTutorials = () => {
  const { toast } = useToast();
  const { documents, setDocuments, updateRecentUpdates } = useSharedData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<DocumentData>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // Initialize documents with categories if they don't have any
  useEffect(() => {
    const docsNeedUpdate = documents.some(doc => !doc.category);
    
    if (docsNeedUpdate) {
      const updatedDocs = documents.map(doc => ({
        ...doc,
        category: doc.category || CATEGORIES[0]
      }));
      
      setDocuments(updatedDocs);
    }
  }, [documents, setDocuments]);

  const handleAddDocument = () => {
    setFormData({ 
      fileType: 'pdf',
      category: CATEGORIES[0]
    });
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
    updateRecentUpdates();
    
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
      updateRecentUpdates();
      
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
      updateRecentUpdates();
      
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
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
