import React from 'react';
import { useForm } from 'react-hook-form';
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
import { useTranslation } from 'react-i18next';
import { BaptismDocument } from '../../types/document';
import { transliterateAmharicToEnglish, transliterateEnglishToAmharic } from '../../utils/transliteration';
import { useDebounce } from '../../hooks/useDebounce';
import { BaptismHeader } from './BaptismHeader';
import { ImageUpload } from '../ui/image-upload';

type BaptismFormData = Omit<BaptismDocument, 'id' | 'created_at' | 'updated_at' | 'priest' | 'recorded_by' | 'approved_by'>;

interface BaptismFormProps {
  onSubmit: (data: BaptismFormData) => Promise<void>;
}

export const BaptismForm: React.FC<BaptismFormProps> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const form = useForm<BaptismFormData>();

  // Track which field was last edited
  const [lastEdited, setLastEdited] = React.useState<{
    field: string;
    isAmharic: boolean;
  } | null>(null);

  // Watch all fields that need transliteration
  const watchedFields = {
    amharic_name: useDebounce(form.watch('amharic_name'), 500),
    english_name: useDebounce(form.watch('english_name'), 500),
    amharic_father_name: useDebounce(form.watch('amharic_father_name'), 500),
    english_father_name: useDebounce(form.watch('english_father_name'), 500),
    amharic_mother_name: useDebounce(form.watch('amharic_mother_name'), 500),
    english_mother_name: useDebounce(form.watch('english_mother_name'), 500),
    amharic_christian_name: useDebounce(form.watch('amharic_christian_name'), 500),
    english_christian_name: useDebounce(form.watch('english_christian_name'), 500),
  };

  // Handle transliteration
  const handleTransliteration = (
    value: string,
    fieldName: string,
    isAmharic: boolean
  ) => {
    setLastEdited({ field: fieldName, isAmharic });
    
    // Get the corresponding field name
    const targetField = isAmharic 
      ? fieldName.replace('amharic_', 'english_')
      : fieldName.replace('english_', 'amharic_');

    // Only update if this field was the last edited
    if (lastEdited?.field !== targetField) {
      const transliterated = isAmharic
        ? transliterateAmharicToEnglish(value)
        : transliterateEnglishToAmharic(value);
      
      form.setValue(targetField as keyof BaptismFormData, transliterated);
    }
  };

  // Effect to handle transliteration for watched fields
  React.useEffect(() => {
    if (!lastEdited) return;

    const { field, isAmharic } = lastEdited;
    const value = watchedFields[field as keyof typeof watchedFields];
    
    if (value) {
      handleTransliteration(value, field, isAmharic);
    }
  }, [Object.values(watchedFields)]);

  // Reset manual edit tracking when form is reset
  const handleSubmit = async (data: BaptismFormData) => {
    try {
      await onSubmit(data);
      form.reset();
      setLastEdited(null);
    } catch (error) {
      console.error('Error submitting baptism form:', error);
    }
  };

  const renderFieldPair = (
    amharicField: string,
    englishField: string,
    label: string,
    required = false
  ) => (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name={amharicField as keyof BaptismFormData}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {label} ({t('baptism.language.amharic')})
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                required={required}
                onChange={(e) => {
                  field.onChange(e);
                  handleTransliteration(e.target.value, amharicField, true);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={englishField as keyof BaptismFormData}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {label} ({t('baptism.language.english')})
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                required={required}
                onChange={(e) => {
                  field.onChange(e);
                  handleTransliteration(e.target.value, englishField, false);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <Form {...form}>
      <BaptismHeader />
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Registration Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('baptism.sections.registration')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="serial_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.serialNumber')}</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      onFile={(file) => {
                        // Here you would typically upload the file to your server
                        console.log('File to upload:', file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('baptism.sections.personal')}</h3>
          <div className="grid grid-cols-2 gap-4">
            {renderFieldPair('amharic_name', 'english_name', t('baptism.fields.name'), true)}
            {renderFieldPair('amharic_christian_name', 'english_christian_name', t('baptism.fields.christianName'))}
            {renderFieldPair('amharic_father_name', 'english_father_name', t('baptism.fields.fatherName'))}
            {renderFieldPair('amharic_mother_name', 'english_mother_name', t('baptism.fields.motherName'))}
          </div>
        </div>

        {/* Birth & Contact Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('baptism.sections.birth')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.dateOfBirth')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="place_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.placeOfBirth')}</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.phoneNumber')}</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.address')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Baptism Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('baptism.sections.baptism')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="baptism_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.baptismDate')}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baptism_place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.baptismPlace')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priest_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.priestName')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Godparent Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('baptism.sections.godparent')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amharic_god_parent_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.godparentName')} ({t('baptism.language.amharic')})</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="english_god_parent_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.godparentName')} ({t('baptism.language.amharic')})</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Witness Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{t('baptism.sections.witness')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amharic_witness_name_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.witness1Name')} ({t('baptism.language.amharic')})</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="english_witness_name_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.witness1Name')} ({t('baptism.language.english')})</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_witness_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.witness1Address')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amharic_witness_name_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.witness2Name')} ({t('baptism.language.amharic')})</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="english_witness_name_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.witness2Name')} ({t('baptism.language.english')})</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_witness_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('baptism.fields.witness2Address')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">{t('baptism.submit')}</Button>
        </div>
      </form>
    </Form>
  );
};
