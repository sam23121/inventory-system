import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Label } from './label';
import { Input } from './input';
import { useFieldTransliteration } from '../../hooks/useFieldTransliteration';

interface FormFieldPairProps {
  form: UseFormReturn<any>;
  amharicField: string;
  englishField: string;
  label: string;
  required?: boolean;
  enableTransliteration?: boolean;
}

export const FormFieldPair: React.FC<FormFieldPairProps> = ({
  form,
  amharicField,
  englishField,
  label,
  required = false,
  enableTransliteration = true,
}) => {
  // Always initialize the hook, but conditionally use its return value
  const { setLastEdited } = useFieldTransliteration(form, [
    { amharic: amharicField, english: englishField }
  ]);

  // Handler for English field changes
  const handleEnglishChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(englishField, e.target.value);
    if (enableTransliteration) {
      setLastEdited({ field: englishField, isAmharic: false });
    }
  };

  // Handler for Amharic field changes
  const handleAmharicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue(amharicField, e.target.value);
    if (enableTransliteration) {
      setLastEdited({ field: amharicField, isAmharic: true });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* English field */}
      <div className="space-y-2">
        <Label htmlFor={englishField}>{label} (English)</Label>
        <Input
          id={englishField}
          {...form.register(englishField, { required })}
          onChange={handleEnglishChange}
        />
      </div>
      
      {/* Amharic field */}
      <div className="space-y-2">
        <Label htmlFor={amharicField}>{label} (አማርኛ)</Label>
        <Input
          id={amharicField}
          {...form.register(amharicField, { required })}
          onChange={handleAmharicChange}
          className="font-amharic"
        />
      </div>
    </div>
  );
};
