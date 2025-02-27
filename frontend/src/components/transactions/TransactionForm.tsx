import React, { useState } from 'react';
import { Transaction, TransactionType } from '../../types/transaction';
import { FormField } from '../ui/form-field';
import { Button } from '../ui/button';

interface BaseTransactionFormProps {
  transactionTypes: TransactionType[];
  onCancel: () => void;
}

interface CreateTransactionFormProps extends BaseTransactionFormProps {
  initialData?: undefined;
  onSubmit: (data: Omit<Transaction, 'id'>) => Promise<void>;
}

interface EditTransactionFormProps extends BaseTransactionFormProps {
  initialData: Partial<Transaction>;
  onSubmit: (data: Partial<Transaction>) => Promise<void>;
}

interface ApproveTransactionFormProps extends BaseTransactionFormProps {
  initialData: Partial<Transaction>;
  onSubmit: (data: Partial<Transaction>) => Promise<void>;
}

type TransactionFormProps = CreateTransactionFormProps | EditTransactionFormProps | ApproveTransactionFormProps;

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  transactionTypes,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    type: initialData?.type || '',
    description: initialData?.description || '',
    quantity: initialData?.quantity || 0,
    dateTaken: initialData?.dateTaken || new Date().toISOString(),
    status: initialData?.status || 'PENDING',
    dateReturned: initialData?.dateReturned || '',
    approved_by: initialData?.approved_by || 0,
    requested_by: initialData?.requested_by || 0
  });
  const [errors, setErrors] = useState<Record<string, string>>({});


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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!formData.dateTaken) newErrors.dateTaken = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'dateTaken') {
      // Convert the date input value to ISO string
      const date = new Date(value);
      setFormData({ ...formData, [name]: date.toISOString() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Type</option>
          {transactionTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.type && (
          <span className="text-sm text-red-500">{errors.type}</span>
        )}
      </div>

      <FormField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
      />

      <FormField
        label="Quantity"
        name="quantity"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
        error={errors.quantity}
      />

      <FormField
        label="Date Taken"
        name="dateTaken"
        type="date"
        value={formData.dateTaken ? formData.dateTaken.split('T')[0] : ''}
        onChange={handleChange}
        error={errors.dateTaken}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Transaction
        </Button>
      </div>
    </form>
  );
};
