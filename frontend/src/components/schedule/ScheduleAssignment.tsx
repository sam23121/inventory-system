import React from 'react';
import { Button } from '../ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Textarea } from '../ui/textarea';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { scheduleService } from '../../services/scheduleService';
import { ScheduleFormData, ScheduleShift } from '../../types/schedule';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  userId: z.string().min(1, "User is required"),
  shiftId: z.string().min(1, "Shift is required"),
  date: z.date(),
  description: z.string().min(1, "Description is required"),
  type: z.string().min(1, "Type is required"),
});

export const ScheduleAssignment = () => {
  const queryClient = useQueryClient();
  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: '',
      shiftId: '',
      date: new Date(),
      description: '',
      type: 'REGULAR'
    },
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userService.getAll();
      return response.data;
    },
  });

  const { data: shifts } = useQuery({
    queryKey: ['shifts'],
    queryFn: async () => {
      const response = await scheduleService.getShifts();
      return response.data;
    },
  });

  const createScheduleMutation = useMutation({
    mutationFn: (data: ScheduleFormData) => scheduleService.create({
      user_id: parseInt(data.userId),
      shift_id: parseInt(data.shiftId),
      date: data.date.toISOString().split('T')[0],
      description: data.description,
      type_id: parseInt(data.type),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      form.reset();
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => createScheduleMutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shiftId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shift</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                    {shifts?.map((shift: ScheduleShift) => (
                    <SelectItem key={shift.id} value={shift.id.toString()}>
                      {shift.name} ({shift.start_time} - {shift.end_time})
                    </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                className="rounded-md border"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter schedule description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createScheduleMutation.isPending}>
          {createScheduleMutation.isPending ? 'Creating...' : 'Assign Schedule'}
        </Button>
      </form>
    </Form>
  );
};
