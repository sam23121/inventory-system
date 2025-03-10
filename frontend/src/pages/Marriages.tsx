import React, { useState, useEffect } from 'react';
import { FormField } from '../components/ui/form-field';
import { Button } from '../components/ui/button';
import { BaptismDocument, MarriageDocument } from '../types/document'; // Ensure you have this type defined
import { marriageDocumentService } from '../services/documentService'; // Assume these functions are defined to interact with your backend
import { useTranslation } from 'react-i18next';

const Members: React.FC = () => {
  const [formData, setFormData] = useState<MarriageDocument>({
    serial_number: '',
    english_name: '',
    english_father_name: '',
    english_mother_name: '',
    english_christian_name: '',
    amharic_name: '',
    amharic_father_name: '',
    amharic_mother_name: '',
    amharic_christian_name: '',
    date_of_birth: new Date(),
    place_of_birth: '',
    address: '',
    phone_number: '',
    priest_name: '',
    priest_id: undefined,
    amharic_witness_name_1: '',
    amharic_witness_name_2: '',
    english_witness_name_1: '',
    english_witness_name_2: '',
    address_witness_1: '',
    address_witness_2: '',
    recorded_by_id: undefined,
    approved_by_id: undefined,
    english_bride_name: '',
    english_bride_father_name: '',
    english_bride_mother_name: '',
    english_bride_christian_name: '',
    amharic_bride_name: '',
    amharic_bride_father_name: '',
    amharic_bride_mother_name: '',
    amharic_bride_christian_name: '',
    date_of_marriage: new Date(),
    place_of_marriage: '',
    english_groom_name: '',
    english_groom_father_name: '',
    english_groom_mother_name: '',
    english_groom_christian_name: '',
    amharic_groom_name: '',
    amharic_groom_father_name: '',
    amharic_groom_mother_name: '',
    amharic_groom_christian_name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [marriageDocuments, setMarriageDocuments] = useState<MarriageDocument[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const { t } = useTranslation();
  
  useEffect(() => {
    const loadItemTypes = async () => {
      try {
        const types = await marriageDocumentService.getAll();
        setMarriageDocuments(types.data);
      } catch (error) {
        console.error('Error fetching item types:', error);
      }
    };

    loadItemTypes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let newValue;
      if (name === 'date_of_birth' || name === 'date_of_marriage') {
        const date = new Date(value);
        date.setHours(0, 0, 0, 0);
        newValue = date;
      } else {
        newValue = ['recorded_by_id', 'approved_by_id', 'priest_id'].includes(name) ? Number(value) : value;
      }
      return {
        ...prev,
        [name]: newValue,
      };
    });
    setMessage(null);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.serial_number) newErrors.serial_number = 'Serial number is required';
    if (!formData.english_name) newErrors.english_name = 'English name is required';
    if (!formData.amharic_name) newErrors.amharic_name = 'Amharic name is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.place_of_birth) newErrors.place_of_birth = 'Place of birth is required';
    if (!formData.english_bride_name) newErrors.english_bride_name = 'Bride English name is required';
    if (!formData.amharic_bride_name) newErrors.amharic_bride_name = 'Bride Amharic name is required';
    if (!formData.date_of_marriage) newErrors.date_of_marriage = 'Date of marriage is required';
    if (!formData.place_of_marriage) newErrors.place_of_marriage = 'Place of marriage is required';
    if (!formData.english_groom_name) newErrors.english_groom_name = 'Groom English name is required';
    if (!formData.amharic_groom_name) newErrors.amharic_groom_name = 'Groom Amharic name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        console.log('Submitting form data:', formData);
        await marriageDocumentService.create(formData);
        setMessage({ text: t('messages.success_item_created'), type: 'success' });
        // Optionally refresh the list of items or clear the form
      } catch (error) {
        console.error('Error submitting item data:', error);
        setMessage({ text: t('messages.error_item_created'), type: 'error' });
      }
    }
  };

  const handleCancel = () => {
    // Optionally refresh the list of items or show a success message
  };

  return (
    <div>
        <h1>{t('pages.marriage_form')}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-wrap gap-4" style={{ maxWidth: '100%' }}>
          <div className="flex flex-wrap w-full gap-4">
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.serial_number')}
                name="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
                error={errors.serial_number}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.english_name')}
                name="english_name"
                value={formData.english_name}
                onChange={handleChange}
                error={errors.english_name}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.english_father_name')}
                name="english_father_name"
                value={formData.english_father_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.english_mother_name')}
                name="english_mother_name"
                value={formData.english_mother_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.english_christian_name')}
                name="english_christian_name"
                value={formData.english_christian_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.amharic_name')}
                name="amharic_name"
                value={formData.amharic_name}
                onChange={handleChange}
                error={errors.amharic_name}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.amharic_father_name')}
                name="amharic_father_name"
                value={formData.amharic_father_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.amharic_mother_name')}
                name="amharic_mother_name"
                value={formData.amharic_mother_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.amharic_christian_name')}
                name="amharic_christian_name"
                value={formData.amharic_christian_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.date_of_birth')}
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth.toISOString().split('T')[0]}
                onChange={handleChange}
                error={errors.date_of_birth}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.place_of_birth')}
                name="place_of_birth"
                value={formData.place_of_birth}
                onChange={handleChange}
                error={errors.place_of_birth}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.address')}
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.phone_number')}
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.priest_name')}
                name="priest_name"
                value={formData.priest_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.priest_id')}
                name="priest_id"
                type="number"
                value={formData.priest_id?.toString() || ''}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.amharic_witness_name_1')}
                name="amharic_witness_name_1"
                value={formData.amharic_witness_name_1}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.amharic_witness_name_2')}
                name="amharic_witness_name_2"
                value={formData.amharic_witness_name_2}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.english_witness_name_1')}
                name="english_witness_name_1"
                value={formData.english_witness_name_1}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.english_witness_name_2')}
                name="english_witness_name_2"
                value={formData.english_witness_name_2}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.address_witness_1')}
                name="address_witness_1"
                value={formData.address_witness_1}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.address_witness_2')}
                name="address_witness_2"
                value={formData.address_witness_2}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.recorded_by_id')}
                name="recorded_by_id"
                type="number"
                value={formData.recorded_by_id?.toString() || ''}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('members.approved_by_id')}
                name="approved_by_id"
                type="number"
                value={formData.approved_by_id?.toString() || ''}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.english_bride_name')}
                name="english_bride_name"
                value={formData.english_bride_name}
                onChange={handleChange}
                error={errors.english_bride_name}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.english_bride_father_name')}
                name="english_bride_father_name"
                value={formData.english_bride_father_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.english_bride_mother_name')}
                name="english_bride_mother_name"
                value={formData.english_bride_mother_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.english_bride_christian_name')}
                name="english_bride_christian_name"
                value={formData.english_bride_christian_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.amharic_bride_name')}
                name="amharic_bride_name"
                value={formData.amharic_bride_name}
                onChange={handleChange}
                error={errors.amharic_bride_name}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.amharic_bride_father_name')}
                name="amharic_bride_father_name"
                value={formData.amharic_bride_father_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.amharic_bride_mother_name')}
                name="amharic_bride_mother_name"
                value={formData.amharic_bride_mother_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.amharic_bride_christian_name')}
                name="amharic_bride_christian_name"
                value={formData.amharic_bride_christian_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.date_of_marriage')}
                name="date_of_marriage"
                type="date"
                value={formData.date_of_marriage?.toISOString().split('T')[0]}
                onChange={handleChange}
                error={errors.date_of_marriage}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.place_of_marriage')}
                name="place_of_marriage"
                value={formData.place_of_marriage}
                onChange={handleChange}
                error={errors.place_of_marriage}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.english_groom_name')}
                name="english_groom_name"
                value={formData.english_groom_name}
                onChange={handleChange}
                error={errors.english_groom_name}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.english_groom_father_name')}
                name="english_groom_father_name"
                value={formData.english_groom_father_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.english_groom_mother_name')}
                name="english_groom_mother_name"
                value={formData.english_groom_mother_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.english_groom_christian_name')}
                name="english_groom_christian_name"
                value={formData.english_groom_christian_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.amharic_groom_name')}
                name="amharic_groom_name"
                value={formData.amharic_groom_name}
                onChange={handleChange}
                error={errors.amharic_groom_name}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.amharic_groom_father_name')}
                name="amharic_groom_father_name"
                value={formData.amharic_groom_father_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.amharic_groom_mother_name')}
                name="amharic_groom_mother_name"
                value={formData.amharic_groom_mother_name}
                onChange={handleChange}
              />
            </div>
            <div className="w-full md:w-1/4 min-w-[200px]">
              <FormField
                label={t('marriage.amharic_groom_christian_name')}
                name="amharic_groom_christian_name"
                value={formData.amharic_groom_christian_name}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" onClick={handleSubmit}>{t('common.create')}</Button>
        </div>
      </form>
      
      {message && (
        <div
          style={{
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            padding: '1rem',
            borderRadius: '4px',
            marginTop: '1rem',
          }}
        >
          {message.text}
        </div>
      )}
      {/* Render other components or content related to members */}
    </div>
  );
};

export default Members;
