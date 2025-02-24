import React, { useEffect, useState } from 'react';
import { Item, ItemType } from '../../types/item';
import { itemService, itemTypeService } from '../../services/itemService';
import { Alert, AlertDescription } from '../ui/alert';
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
import { ItemForm } from './ItemForm';
import { Input } from '../ui/input';

interface ItemListProps {
  items: Item[];
  itemTypes: ItemType[];
  onItemUpdate: () => void;
}

export const ItemList: React.FC<ItemListProps> = ({items, itemTypes, onItemUpdate}) => {
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.delete(id);
        onItemUpdate();
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: Partial<Item>) => {
    try {
      if (selectedItem?.id) {
        await itemService.update(selectedItem.id, data);
        onItemUpdate();
        setIsEditModalOpen(false);
        setSelectedItem(null);
      }
    } catch (err) {
      setError('Failed to update item');
    }
  };

  const handleCreateSubmit = async (data: Partial<Item>) => {
    try {
      await itemService.create(data as Omit<Item, 'id'>);
      onItemUpdate();
      setIsCreateModalOpen(false);
    } catch (err) {
      setError('Failed to create item');
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Item
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Date Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.serial_number}</TableCell>
              <TableCell>{item.item_type?.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{new Date(item.dateUpdated).toLocaleDateString()}</TableCell>
              <TableCell className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(item)}
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <ItemForm
            initialData={selectedItem || undefined}
            itemTypes={itemTypes}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Item</DialogTitle>
          </DialogHeader>
          <ItemForm
            itemTypes={itemTypes}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
