import React from 'react';
import { Input } from './input';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <Input {...props} />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
};
