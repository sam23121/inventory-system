import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useTranslation } from 'react-i18next';

interface Type {
  id: number;
  name: string;
  description: string;
}

interface TypeFormProps {
  initialData?: Partial<Type>;
  onSubmit: (data: Partial<Type>) => Promise<void>;
  onCancel: () => void;
}

export const TypeForm: React.FC<TypeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">{t('common.name')}</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">{t('common.description')}</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit">
          {initialData ? t('common.update') : t('common.create')}
        </Button>
      </div>
    </form>
  );
};
