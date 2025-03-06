import React, {useEffect, useState} from "react";
import {AxiosResponse} from "axios";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../ui/table";
import {Button} from "../ui/button";
import {Edit, Trash2, Plus, Search} from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "../ui/dialog";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {Alert, AlertDescription} from "../ui/alert";
import {usePagination} from "../../hooks/usePagination";
import {Pagination} from "../ui/pagination";
import {ScheduleShift} from "../../types/schedule";
import { useTranslation } from 'react-i18next';

interface ShiftListProps {
    title: string;
    service: {
        getAll: () => Promise<{ data: ScheduleShift[] }>;
        create: (data: Omit<ScheduleShift, 'id'>) => Promise<{ data: ScheduleShift }>;
        update: (id: number, data: Partial<ScheduleShift>) => Promise<{ data: ScheduleShift }>;
        delete: (id: number) => Promise<AxiosResponse>;
    };
    items: ScheduleShift[];
    onItemUpdate: () => void;
}

export const ShiftList: React.FC<ShiftListProps> = ({title, service, items, onItemUpdate}) => {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ScheduleShift | null>(null);
    const [formData, setFormData] = useState({name: '', description:'', start_time: '', end_time: ''});
    const [searchQuery, setSearchQuery] = useState('');

    const ITEMS_PER_PAGE = 5;

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
            setFormData({name: '', description:'', start_time: '', end_time: ''});
        } catch (e) {
            setError(`Failed to ${selectedItem ? 'update' : 'create'} ${title}`);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await service.delete(id);
            onItemUpdate();
        } catch (e) {
            setError(`Failed to delete ${title}`);
        }
    };


    const filteredItems = items.filter((item) => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.start_time.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.end_time.toLowerCase().includes(searchQuery.toLowerCase())
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

      if (error) return <Alert variant="destructive">{error}</Alert>;

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
              setFormData({ name: '', description: '', start_time: '', end_time: '' });
              setIsModalOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              {t('schedule.createShift')}
            </Button>
          </div>
    
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.name')}</TableHead>
                <TableHead>{t('common.description')}</TableHead>
                <TableHead>{t('schedule.startTime')}</TableHead>
                <TableHead>{t('schedule.endTime')}</TableHead>
                <TableHead>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.start_time}</TableCell>
                  <TableCell>{item.end_time}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setFormData({ name: item.name, description: item.description, start_time: item.start_time, end_time: item.end_time });
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
                <DialogTitle>{selectedItem ? t('schedule.editShift') : t('schedule.createShift')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('common.name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">{t('common.description')}</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="start_time">{t('schedule.startTime')}</Label>
                  <Input
                    id="start_time"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    required
                  />
                </div>
                <div>
                    <Label htmlFor="end_time">{t('schedule.endTime')}</Label>
                    <Input
                        id="end_time"
                        value={formData.end_time}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                        required
                    />  
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit">
                    {selectedItem ? t('common.update') : t('common.create')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </>
      );
    };