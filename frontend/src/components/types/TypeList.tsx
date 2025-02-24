import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../ui/pagination';

interface Type {
  id: number;
  name: string;
  description: string;
}

interface TypeListProps {
  title: string;
  service: {
    getAll: () => Promise<{ data: Type[] }>;
    create: (data: Omit<Type, 'id'>) => Promise<{ data: Type }>;
    update: (id: number, data: Partial<Type>) => Promise<{ data: Type }>;
    delete: (id: number) => Promise<AxiosResponse>;
  };
  items: Type[];
  onItemUpdate: () => void;
}

export const TypeList: React.FC<TypeListProps> = ({ title, service, items, onItemUpdate }) => {
//   const [items, setItems] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Type | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const ITEMS_PER_PAGE = 5;

//   const fetchItems = async () => {
//     try {
//       const response = await service.getAll();
//       setItems(response.data);
//     } catch (err) {
//       setError(`Failed to fetch ${title}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchItems();
//   }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await service.update(selectedItem.id, formData);
      } else {
        await service.create(formData);
      }
      await onItemUpdate();
      setIsModalOpen(false);
      setSelectedItem(null);
      setFormData({ name: '', description: '' });
    } catch (err) {
      setError(`Failed to ${selectedItem ? 'update' : 'create'} ${title}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(`Are you sure you want to delete this ${title}?`)) {
      try {
        await service.delete(id);
        onItemUpdate();
      } catch (err) {
        setError(`Failed to delete ${title}`);
      }
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage
  } = usePagination({
    totalItems: filteredItems.length,
    itemsPerPage: ITEMS_PER_PAGE
  });

  const paginatedItems = filteredItems.slice(startIndex, endIndex);

//   if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => {
          setSelectedItem(null);
          setFormData({ name: '', description: '' });
          setIsModalOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Create {title}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item);
                    setFormData({ name: item.name, description: item.description });
                    setIsModalOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem ? `Edit ${title}` : `Create ${title}`}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedItem ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
