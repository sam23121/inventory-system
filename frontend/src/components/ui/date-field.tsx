import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Input } from './input';
import { UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { formatDateForInput } from '../../utils/date-format';

interface DateFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
}

export function DateField<T extends FieldValues>({
  form,
  name,
  label,
  required = false,
}: DateFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              type="date" 
              value={formatDateForInput(field.value)} 
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              required={required}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
