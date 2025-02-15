import React, { useState } from 'react';
import { User, UserType } from '../../types/user';
import { FormField } from '../ui/form-field';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const userData = {
          name: formData.name || '',
          phone_number: formData.phone_number || '',
          type_id: Number(formData.type_id) || 0,
          password: formData.password,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
