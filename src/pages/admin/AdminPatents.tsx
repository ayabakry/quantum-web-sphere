
import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import ContentTable from '@/components/admin/ContentTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PatentData } from '@/components/patents/PatentCard';

// Mock data for patents
const initialPatents: PatentData[] = [
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
];

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'patentNumber', label: 'Patent Number' },
  { key: 'status', label: 'Status' },
  { key: 'filingDate', label: 'Filing Date' },
];

const AdminPatents = () => {
  const { toast } = useToast();
  const [patents, setPatents] = useState(initialPatents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<PatentData>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddPatent = () => {
    setFormData({ status: 'pending', inventors: [''] });
    setEditingId(null);
    setIsDialogOpen(true);
  };

  const handleEditPatent = (id: string) => {
    const patentToEdit = patents.find(p => p.id === id);
    if (patentToEdit) {
      setFormData(patentToEdit);
      setEditingId(id);
      setIsDialogOpen(true);
    }
  };

  const handleDeletePatent = (id: string) => {
    setPatents(patents.filter(p => p.id !== id));
    toast({
      title: "Patent deleted",
      description: "The patent has been removed successfully",
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing patent
      setPatents(patents.map(p => p.id === editingId ? { ...p, ...formData } as PatentData : p));
      toast({
        title: "Patent updated",
        description: "The patent has been updated successfully",
      });
    } else {
      // Add new patent
      const newPatent = {
        ...formData,
        id: String(Date.now()),
      } as PatentData;
      
      setPatents([...patents, newPatent]);
      toast({
        title: "Patent added",
        description: "The new patent has been added successfully",
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

  const handleInventorChange = (index: number, value: string) => {
    const inventors = [...(formData.inventors || [])];
    inventors[index] = value;
    setFormData({ ...formData, inventors });
  };

  const addInventor = () => {
    setFormData({
      ...formData,
      inventors: [...(formData.inventors || []), ''],
    });
  };

  const removeInventor = (index: number) => {
    const inventors = [...(formData.inventors || [])];
    inventors.splice(index, 1);
    setFormData({ ...formData, inventors });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Patents</h1>
        <Button onClick={handleAddPatent}>
          <Plus className="h-4 w-4 mr-2" /> Add Patent
        </Button>
      </div>
      
      <ContentTable
        columns={columns}
        data={patents}
        onEdit={handleEditPatent}
        onDelete={handleDeletePatent}
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Patent' : 'Add New Patent'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update the patent details below'
                : 'Enter the details for the new patent'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Patent Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="patentNumber">Patent Number</Label>
              <Input
                id="patentNumber"
                name="patentNumber"
                value={formData.patentNumber || ''}
                onChange={handleInputChange}
                placeholder="e.g. US10234567"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value as 'pending' | 'granted' | 'rejected')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="granted">Granted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filingDate">Filing Date</Label>
                <Input
                  id="filingDate"
                  name="filingDate"
                  type="date"
                  value={formData.filingDate || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publicationDate">Publication Date</Label>
                <Input
                  id="publicationDate"
                  name="publicationDate"
                  type="date"
                  value={formData.publicationDate || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Inventors</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addInventor}
                >
                  Add Inventor
                </Button>
              </div>
              
              {formData.inventors?.map((inventor, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={inventor}
                    onChange={(e) => handleInventorChange(index, e.target.value)}
                    placeholder={`Inventor ${index + 1}`}
                  />
                  {formData.inventors!.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInventor(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                name="abstract"
                value={formData.abstract || ''}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Update Patent' : 'Add Patent'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminPatents;
