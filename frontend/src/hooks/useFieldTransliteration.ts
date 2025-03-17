import { useState, useEffect, useRef } from 'react';
import { UseFormReturn, FieldValues, Path, PathValue } from 'react-hook-form';
import { useDebounce } from './useDebounce';
import { transliterateAmharicToEnglish, transliterateEnglishToAmharic } from '../utils/transliteration';

interface TransliterationField {
  amharic: string;
  english: string;
}

export const useFieldTransliteration = <T extends FieldValues>(
  form: UseFormReturn<T>,
  fieldPairs: TransliterationField[]
) => {
  const [lastEdited, setLastEdited] = useState<{
    field: string;
    isAmharic: boolean;
  } | null>(null);
  
  // Keep track if transliteration is active
  const isActive = useRef(true);

  // Create a map of all fields to watch with their debounced values
  const watchedFields = fieldPairs.reduce((acc, { amharic, english }) => {
    acc[amharic] = useDebounce(form.watch(amharic as Path<T>), 500);
    acc[english] = useDebounce(form.watch(english as Path<T>), 500);
    return acc;
  }, {} as Record<string, any>);

  // Handle transliteration
  const handleTransliteration = (
    value: string,
    fieldName: string,
    isAmharic: boolean
  ) => {
    if (!isActive.current) return;
    
    // Get the corresponding field name
    const targetField = isAmharic 
      ? fieldName.replace('amharic_', 'english_')
      : fieldName.replace('english_', 'amharic_');

    // Only update if target field was not the last edited
    if (lastEdited?.field !== targetField) {
      const transliterated = isAmharic
        ? transliterateAmharicToEnglish(value)
        : transliterateEnglishToAmharic(value);
      
      form.setValue(targetField as Path<T>, transliterated as PathValue<T, Path<T>>);
    }
  };

  // Effect to handle transliteration for watched fields
  useEffect(() => {
    if (!lastEdited || !isActive.current) return;

    const { field, isAmharic } = lastEdited;
    const value = watchedFields[field];
    
    if (value) {
      handleTransliteration(value, field, isAmharic);
    }
  }, [Object.values(watchedFields)]);

  // Method to enable/disable transliteration functionality
  const setActive = (active: boolean) => {
    isActive.current = active;
  };

  return {
    lastEdited,
    setLastEdited,
    handleTransliteration,
    setActive
  };
};
