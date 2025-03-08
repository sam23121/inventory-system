import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ScheduleShift } from '../../types/schedule';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface ShiftFormProps {
  initialData?: ScheduleShift;
  onSubmit: (data: Partial<ScheduleShift>) => void;
  onCancel: () => void;
}

export const ShiftForm: React.FC<ShiftFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const methods = useForm<Partial<ScheduleShift>>({
    defaultValues: {
      id: initialData?.id,
      description: initialData?.description || '',
      start_time: initialData?.start_time || '',
      end_time: initialData?.end_time || '',
    },
  });

  const handleSubmit = (data: Partial<ScheduleShift>) => {
    // Format the date as ISO string before submitting
    const formattedData = {
      ...data,
      
    };
    onSubmit(formattedData);
  };

  return (
    <FormProvider {...methods}>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
          
            <FormField
                control={methods.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                    <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={methods.control}
                name="start_time"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                    <Input {...field} type="time" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={methods.control}
                name="end_time"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                    <Input {...field} type="time" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

          <FormField
            control={methods.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default ShiftForm;