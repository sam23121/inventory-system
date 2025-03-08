import React, { useState } from 'react';
import { Document, DocumentType } from '../../types/document';
import { FormField } from '../ui/form-field';
import { Button } from '../ui/button';
import { useTranslation } from 'react-i18next';
interface DocumentFormProps {
  initialData?: Partial<Document>;
  documentTypes: DocumentType[];
  onSubmit: (data: Partial<Document>) => Promise<void>;
  onCancel: () => void;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  initialData,
  documentTypes,
  onSubmit,
  onCancel,
}) => {

  const [formData, setFormData] = useState<Partial<Document>>(
    initialData || {
      name: '',
      type_id: 0,
      description: '',
      quantity: 0,
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useTranslation();

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
    if (!formData.type_id) newErrors.type = 'Type is required';
    if (formData.quantity === undefined) {
      newErrors.quantity = 'Quantity is required';
    } else if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity must be positive';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const processedData = {
          ...formData,
          quantity: Number(formData.quantity)
        };
        
        await onSubmit(processedData);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label={t('common.name')}
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{t('common.type')}</label>
        <select
          name="type_id"
          value={formData.type_id}
          onChange={handleChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Type</option>
          {documentTypes.map((type) => (
            <option key={type.id} value={type.id}>  {/* Use type.id as the value */}
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
        value={formData.quantity?.toString()}
        onChange={handleChange}
        error={errors.quantity}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Document
        </Button>
      </div>
    </form>
  );
};