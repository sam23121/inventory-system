import React, { useState } from 'react';
import { AxiosResponse } from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../ui/pagination';
import { useTranslation } from 'react-i18next';
import { TypeForm } from './TypeForm';

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
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Type | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const ITEMS_PER_PAGE = 5;

  const handleSubmit = async (data: Partial<Type>) => {
    try {
      if (selectedItem) {
        await service.update(selectedItem.id, data);
      } else {
        await service.create(data as Omit<Type, 'id'>);
      }
      await onItemUpdate();
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (err) {
      setError(`Failed to ${selectedItem ? 'update' : 'create'} ${title}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('common.deleteConfirmation'))) {
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

  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={() => {
          setSelectedItem(null);
          setIsModalOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          {t('common.create')} {t(title)}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('common.name')}</TableHead>
            <TableHead>{t('common.description')}</TableHead>
            <TableHead>{t('common.actions')}</TableHead>
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
            <DialogTitle>{selectedItem ? t('common.edit') : t('common.create')} {title}</DialogTitle>
          </DialogHeader>
          <TypeForm
            initialData={selectedItem || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
