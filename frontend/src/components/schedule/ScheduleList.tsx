import React, { useState } from 'react';
import { Schedule, ScheduleShift, ScheduleType } from '../../types/schedule';
import { User } from '../../types/user';
import { scheduleService } from '../../services/scheduleService';
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
import { ScheduleForm } from './ScheduleForm';
import { Input } from '../ui/input';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface ScheduleListProps {
  schedules: Schedule[];
  scheduleTypes: ScheduleType[];
  scheduleShifts: ScheduleShift[];
  users: User[];
  onScheduleUpdate: () => void;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({ 
  schedules, 
  scheduleTypes,
  scheduleShifts,
  users,
  onScheduleUpdate 
}) => {
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await scheduleService.delete(id);
        onScheduleUpdate();
      } catch (err) {
        setError('Failed to delete schedule');
      }
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: Partial<Schedule>) => {
    try {
      if (selectedSchedule?.id) {
        await scheduleService.update(selectedSchedule.id, {
          ...data,
          date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        });
        await onScheduleUpdate();
        setIsEditModalOpen(false);
        setSelectedSchedule(null);
      }
    } catch (err) {
      console.error('Failed to update schedule:', err);
    }
  };

  const handleCreateSubmit = async (data: Partial<Schedule>) => {
    try {
      await scheduleService.create({
        user_id: data.user_id as number,
        shift_id: data.shift_id as number,
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        description: data.description as string,
        type_id: data.type_id as number,
        assigned_by_id: 1,
        approved_by_id: 1,
      });
      await onScheduleUpdate();
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create schedule:', err);
    }
  };

  const filteredSchedules = schedules?.filter(schedule => 
    schedule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.schedule_type?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.shift?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('schedule.searchSchedules')}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('schedule.createSchedule')}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('common.id-2')}</TableHead>
            <TableHead>{t('common.name')}</TableHead>
            <TableHead>{t('common.date')}</TableHead>
            <TableHead>{t('schedule.shift')}</TableHead>
            <TableHead>{t('common.type')}</TableHead>
            <TableHead>{t('common.description')}</TableHead>
            <TableHead>{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSchedules?.map((schedule) => (
            <TableRow key={schedule.id}>
              {/* counter */}
              <TableCell>{schedule.id}</TableCell>
              <TableCell>{schedule.user?.name}</TableCell>
              <TableCell>{format(new Date(schedule.date), 'PPP')}</TableCell>
              <TableCell>{schedule.shift?.name}</TableCell>
              <TableCell>{schedule.schedule_type?.name}</TableCell>
              <TableCell>{schedule.description}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(schedule)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(schedule.id)}
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
            <DialogTitle>{t('schedule.editSchedule')}</DialogTitle>
          </DialogHeader>
          <ScheduleForm
            initialData={selectedSchedule || undefined}
            shifts={scheduleShifts}
            types={scheduleTypes}
            users={users}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('schedule.createSchedule')}</DialogTitle>
          </DialogHeader>
          <ScheduleForm
            initialData={undefined}
            shifts={scheduleShifts}
            types={scheduleTypes}
            users={users}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScheduleList;
