import React, { useState } from 'react';
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
import { Alert, AlertDescription } from '../ui/alert';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../ui/pagination';
import { useTranslation } from 'react-i18next';

interface Column {
  header: string;
  accessor: string;
  render?: (item: any) => React.ReactNode;
}

interface TableListProps {
  title: string;
  items: any[];
  columns: Column[];
  Form: React.ComponentType<any>;
  service: {
    delete: (id: number) => Promise<any>;
  };
  onUpdate: () => void;
  additionalControls?: React.ReactNode;
  searchFields?: string[];
}

export const TableList: React.FC<TableListProps> = ({
  title,
  items,
  columns,
  Form,
  service,
  onUpdate,
  additionalControls,
  searchFields = ['name']
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const ITEMS_PER_PAGE = 5;

  const handleDelete = async (id: number) => {
    if (window.confirm(t('common.deleteConfirmation'))) {
      try {
        await service.delete(id);
        onUpdate();
      } catch (err) {
        setError(`Failed to delete ${title}`);
      }
    }
  };

  const filteredItems = items.filter(item =>
    searchFields.some(field => 
      String(item[field])?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const {
    currentPage,
    totalPages,
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
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${title}...`}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {additionalControls}
          <Button onClick={() => {
            setSelectedItem(null);
            setIsModalOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            {t('common.create')} {title}
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('common.id-2')}</TableHead>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
            <TableHead>{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{startIndex + paginatedItems.indexOf(item) + 1}</TableCell>
              {columns.map((column, index) => (
                <TableCell key={index}>
                  {column.render ? column.render(item) : item[column.accessor]}
                </TableCell>
              ))}
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
            <DialogTitle>
              {selectedItem ? t('common.edit') : t('common.create')} {title}
            </DialogTitle>
          </DialogHeader>
          <Form
            initialData={selectedItem}
            onSubmit={async (data: any) => {
              try {
                await onUpdate();
                setIsModalOpen(false);
                setSelectedItem(null);
                return true; // Add this return value
              } catch (err) {
                setError(`Failed to ${selectedItem ? 'update' : 'create'} ${title}`);
                return false; // Add this return value
              }
            }}
            onCancel={() => {
              setIsModalOpen(false);
              setSelectedItem(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
