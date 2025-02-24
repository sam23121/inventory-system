import React, { useState } from 'react';
import { Schedule } from '../../types/schedule';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

export const ScheduleList = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: schedules, isLoading, isError } = useQuery({
    queryKey: ['schedules'],
    queryFn: async () => {
      const response = await scheduleService.getAll();
      return response.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => scheduleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
    },
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: Partial<Schedule>) => {
    try {
      if (selectedSchedule?.id) {
        await scheduleService.update(selectedSchedule.id, data);
        queryClient.invalidateQueries({ queryKey: ['schedules'] });
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
        date: data.date as string,
        description: data.description as string,
        type_id: data.type_id as number,
      });
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create schedule:', err);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to fetch schedules</AlertDescription>
      </Alert>
    );
  }

  const filteredSchedules = schedules?.filter(schedule => 
    schedule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.shift.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schedules..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Schedule
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSchedules?.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>{schedule.user_id}</TableCell>
              <TableCell>{format(new Date(schedule.date), 'PPP')}</TableCell>
              <TableCell>{schedule.shift?.name}</TableCell>
              <TableCell>{schedule.type?.name}</TableCell>
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
            <DialogTitle>Edit Schedule</DialogTitle>
          </DialogHeader>
          <ScheduleForm
            initialData={selectedSchedule || undefined}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Schedule</DialogTitle>
          </DialogHeader>
          <ScheduleForm
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScheduleList;
