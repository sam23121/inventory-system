import React, { useState, useRef } from 'react';
import { User, UserType } from '../../types/user';
import { FormField } from '../ui/form-field';
import { Button } from '../ui/button';
import { Eye, EyeOff, Upload } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

interface UserFormProps {
  initialData?: Partial<User>;
  userTypes: UserType[];
  onSubmit: (data: Partial<User>) => Promise<void>;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  userTypes,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<User>>(
    initialData || {
      name: '',
      phone_number: '',
      type_id: 0,
      password: '',
      confirm_password: '',
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(
    initialData?.profile_picture || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const userData = {
          name: formData.name,
          phone_number: formData.phone_number,
          type_id: Number(formData.type_id),
          password: formData.password,
          profile_picture: formData.profile_picture,
        };
        await onSubmit(userData);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
    if (!formData.type_id) newErrors.user_type = 'User type is required';
    if (!initialData) {
      if (!formData.password) newErrors.password = 'Password is required';
      if (!formData.confirm_password) newErrors.confirm_password = 'Please confirm password';
      if (formData.password !== formData.confirm_password) {
        newErrors.confirm_password = 'Passwords do not match';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        profile_picture: 'File size must be less than 5MB'
      }));
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        profile_picture: 'Please upload an image file'
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfilePreview(base64String);
      setFormData(prev => ({ ...prev, profile_picture: base64String }));
      // Clear any previous errors
      setErrors(prev => {
        const { profile_picture, ...rest } = prev;
        return rest;
      });
    };

    reader.onerror = () => {
      setErrors(prev => ({
        ...prev,
        profile_picture: 'Error reading file'
      }));
    };

    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={profilePreview || undefined} alt="Profile" />
          <AvatarFallback>{formData.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Picture
          </Button>
          {errors.profile_picture && (
            <span className="text-sm text-red-500">{errors.profile_picture}</span>
          )}
        </div>
      </div>

      <FormField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      
      <FormField
        label="Phone Number"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        error={errors.phone_number}
      />

      <div className="flex flex-col gap-1">
        <div className="relative">
          <FormField
            type={showPassword ? "text" : "password"}
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="relative">
          <FormField
            type={showConfirmPassword ? "text" : "password"}
            label='Confirm Password'
            name='confirm_password'
            value={formData.confirm_password}
            onChange={handleChange}
            error={errors.confirm_password}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 "
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">User Type</label>
        <select
          name="type_id"
          value={formData.type_id}
          onChange={handleChange}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select User Type</option>
          {userTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name} 
            </option>
          ))}
        </select>
        {errors.user_type && (
          <span className="text-sm text-red-500">{errors.user_type}</span>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} User
        </Button>
      </div>
    </form>
  );
};
