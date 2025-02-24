import React, { useState } from 'react';
import { Schedule } from '../../types/schedule';
import { FormField } from '../ui/form-field';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { useQuery } from '@tanstack/react-query';
import { scheduleService } from '../../services/scheduleService';
import { userService } from '../../services/userService';
import { Label } from '../ui/label';
import { useAuth } from '../../hooks/useAuth';

interface ScheduleFormProps {
  initialData?: Partial<Schedule>;
  onSubmit: (data: Partial<Schedule>) => Promise<void>;
  onCancel: () => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Schedule>>(
    initialData || {
      date: new Date().toISOString(),
      description: '',
      type_id: 0,
      shift_id: 0,
      user_id: 0,
      assigned_by_id: 0,
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // get current user from useAuth hook
  const { user } = useAuth();

  const { data: shifts } = useQuery({
    queryKey: ['shifts'],
    queryFn: async () => {
      const response = await scheduleService.getShifts();
      return response.data;
    }
  });

  const { data: types } = useQuery({
    queryKey: ['scheduleTypes'],
    queryFn: async () => {
      const response = await scheduleService.getScheduleTypes();
      return response.data;
    }
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userService.getAll();
      return response.data;
    }
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date: date.toISOString(),
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.shift_id) newErrors.shift_id = 'Shift is required';
    if (!formData.type_id) newErrors.type_id = 'Type is required';
    if (!formData.user_id) newErrors.user_id = 'User is required';
    formData.assigned_by_id = user?.id;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="space-y-2">
        <Label>User</Label>
        <select
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Select User</option>
          {users?.map((user: { id: number; name: string }) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {errors.user_id && (
          <span className="text-sm text-red-500">{errors.user_id}</span>
        )}
      </div>
    
      <div className="space-y-2">
        <Label>Date</Label>
        <Calendar
          mode="single"
          selected={new Date(formData.date || '')}
          onSelect={handleDateChange}
          className="rounded-md border"
        />
        {errors.date && (
          <span className="text-sm text-red-500">{errors.date}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label>Shift</Label>
        <select
          name="shift_id"
          value={formData.shift_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Select Shift</option>
          {shifts?.map((shift: { id: number; name: string }) => (
            <option key={shift.id} value={shift.id}>
              {shift.name}
            </option>
          ))}
        </select>
        {errors.shift_id && (
          <span className="text-sm text-red-500">{errors.shift_id}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <select
          name="type_id"
          value={formData.type_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Select Type</option>
          {types?.map((type: { id: number; name: string }) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.type_id && (
          <span className="text-sm text-red-500">{errors.type_id}</span>
        )}
      </div>

      <FormField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Schedule
        </Button>
      </div>
    </form>
  );
};
