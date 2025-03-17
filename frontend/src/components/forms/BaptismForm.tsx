import React, { useState } from 'react';
import { BaptismDocument } from '../../types/document';
import { User } from '../../types/user';
import { FormFieldPair } from '../ui/form-field-pair';
import { useForm, UseFormProps } from 'react-hook-form';
import { Form } from '../ui/form';

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

// Remove Grid, GridItem, H2, H3 imports

interface BaptismFormProps {
  initialData?: BaptismDocument;
  onSubmit: (data: BaptismDocument) => void;
  priests?: User[];
  isLoading?: boolean;
}

// Use a simpler record type to avoid circular references
type BaptismFormValues = Record<string, any>;

const BaptismForm: React.FC<BaptismFormProps> = ({ 
  initialData, 
  onSubmit, 
  priests = [],
  isLoading = false 
}) => {
  const defaultValues: BaptismDocument = {
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
    baptism_date: new Date(),
    baptism_place: '',
    amharic_god_parent_name: '',
    english_god_parent_name: '',
  };

  // Format default dates for form inputs
  const formattedData = initialData ? {
    ...initialData,
    date_of_birth: initialData.date_of_birth instanceof Date 
      ? formatDateForInput(initialData.date_of_birth)
      : initialData.date_of_birth,
    baptism_date: initialData.baptism_date instanceof Date 
      ? formatDateForInput(initialData.baptism_date)
      : initialData.baptism_date
  } : {
    ...defaultValues,
    date_of_birth: formatDateForInput(defaultValues.date_of_birth),
    baptism_date: formatDateForInput(defaultValues.baptism_date || new Date())
  };

  // Use BaptismFormValues instead of BaptismDocument to avoid circular references
  const form = useForm<BaptismFormValues>({
    defaultValues: formattedData,
  } as UseFormProps<BaptismFormValues>);

  const handleFormSubmit = (formData: BaptismFormValues) => {
    // Convert string dates back to Date objects before submitting
    const processedData = {
      ...formData,
      date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth) : null,
      baptism_date: formData.baptism_date ? new Date(formData.baptism_date) : null
    };
    
    onSubmit(processedData as BaptismDocument);
  };

  // Helper function to format Date objects as YYYY-MM-DD for input fields
  function formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Baptism Certificate</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="grid grid-cols-12 gap-6">
              {/* Serial Number */}
              <div className="col-span-4">
                <div className="space-y-2">
                  <Label htmlFor="serial_number">Certificate Serial Number</Label>
                  <Input
                    id="serial_number"
                    {...form.register("serial_number", { required: true })}
                  />
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="col-span-12">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <Separator className="my-2" />
              </div>

              {/* Name Fields (English-Amharic pairs) */}
              <div className="col-span-12">
                <FormFieldPair
                  form={form}
                  amharicField="amharic_name"
                  englishField="english_name"
                  label="Name"
                  required={true}
                  enableTransliteration={true}
                />
              </div>

              <div className="col-span-12">
                <FormFieldPair
                  form={form}
                  amharicField="amharic_father_name"
                  englishField="english_father_name"
                  label="Father's Name"
                  enableTransliteration={true}
                />
              </div>

              <div className="col-span-12">
                <FormFieldPair
                  form={form}
                  amharicField="amharic_mother_name"
                  englishField="english_mother_name"
                  label="Mother's Name"
                  enableTransliteration={true}
                />
              </div>

              <div className="col-span-12">
                <FormFieldPair
                  form={form}
                  amharicField="amharic_christian_name"
                  englishField="english_christian_name"
                  label="Christian Name"
                  enableTransliteration={true}
                />
              </div>

              {/* Date and Place of Birth */}
              <div className="col-span-12 md:col-span-6">
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    {...form.register("date_of_birth", { required: true })}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="space-y-2">
                  <Label htmlFor="place_of_birth">Place of Birth</Label>
                  <Input
                    id="place_of_birth"
                    {...form.register("place_of_birth", { required: true })}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="col-span-12 md:col-span-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    {...form.register("address")}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    {...form.register("phone_number")}
                  />
                </div>
              </div>

              {/* Baptism Details Section */}
              <div className="col-span-12">
                <h3 className="text-lg font-semibold">Baptism Details</h3>
                <Separator className="my-2" />
              </div>

              {/* Baptism Date and Place */}
              <div className="col-span-12 md:col-span-6">
                <div className="space-y-2">
                  <Label htmlFor="baptism_date">Baptism Date</Label>
                  <Input
                    id="baptism_date"
                    type="date"
                    {...form.register("baptism_date", { required: true })}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="space-y-2">
                  <Label htmlFor="baptism_place">Baptism Place</Label>
                  <Input
                    id="baptism_place"
                    {...form.register("baptism_place")}
                  />
                </div>
              </div>

              {/* God Parent Information */}
              <div className="col-span-12">
                <FormFieldPair
                  form={form}
                  amharicField="amharic_god_parent_name"
                  englishField="english_god_parent_name"
                  label="God Parent Name"
                  enableTransliteration={true}
                />
              </div>

              {/* Priest Selection */}
              <div className="col-span-12">
                <h3 className="text-lg font-semibold">Church Officials</h3>
                <Separator className="my-2" />
              </div>
              
              <div className="col-span-12 md:col-span-6">
                <div className="space-y-2">
                  <Label htmlFor="priest_id">Priest</Label>
                  <Select
                    value={form.watch("priest_id")?.toString() || ''}
                    onValueChange={(value) => {
                      if (value === "0") {
                        form.setValue("priest_id", undefined);
                      } else {
                        form.setValue("priest_id", Number(value));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a priest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
                      {priests.map((priest) => (
                        <SelectItem key={priest.id} value={String(priest.id)}>
                          {priest.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6">
                <div className="space-y-2">
                  <Label htmlFor="priest_name">Priest Name (if not in list)</Label>
                  <Input
                    id="priest_name"
                    {...form.register("priest_name")}
                  />
                </div>
              </div>

              {/* Witness Information Section */}
              <div className="col-span-12">
                <h3 className="text-lg font-semibold">Witness Information</h3>
                <Separator className="my-2" />
              </div>

              {/* First Witness */}
              <div className="col-span-12">
                <FormFieldPair
                  form={form}
                  amharicField="amharic_witness_name_1"
                  englishField="english_witness_name_1"
                  label="Witness 1 Name"
                  enableTransliteration={true}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="space-y-2">
                  <Label htmlFor="address_witness_1">Witness 1 Address</Label>
                  <Input
                    id="address_witness_1"
                    {...form.register("address_witness_1")}
                  />
                </div>
              </div>

              {/* Second Witness */}
              <div className="col-span-12">
                <FormFieldPair
                  form={form}
                  amharicField="amharic_witness_name_2"
                  englishField="english_witness_name_2"
                  label="Witness 2 Name"
                  enableTransliteration={true}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="space-y-2">
                  <Label htmlFor="address_witness_2">Witness 2 Address</Label>
                  <Input
                    id="address_witness_2"
                    {...form.register("address_witness_2")}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-span-12">
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Baptism Certificate"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BaptismForm;
