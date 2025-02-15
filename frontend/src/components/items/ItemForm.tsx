import React, { useState } from 'react';
import { Item, ItemType } from '../../types/item';
import { Button } from '../ui/button';
import { FormField } from '../ui/form-field';

interface ItemFormProps {
  initialData?: Partial<Item>;
  itemTypes: ItemType[];
  onSubmit: (data: Partial<Item>) => Promise<void>;
  onCancel: () => void;
}

export const ItemForm: React.FC<ItemFormProps> = ({
  initialData,
  itemTypes,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Item>>(
    initialData || {
      name: '',
      type: '',
      description: '',
      quantity: 0,
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value,
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if ((formData.quantity ?? 0) < 0) newErrors.quantity = 'Quantity must be positive';
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
      <FormField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Type</option>
          {itemTypes.map((type) => (
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
      />

      <FormField
        label="Quantity"
        name="quantity"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
        error={errors.quantity}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Item
        </Button>
      </div>
    </form>
  );
};
