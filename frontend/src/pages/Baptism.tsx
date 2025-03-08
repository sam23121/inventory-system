import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { BaptismForm } from '../components/baptism/BaptismForm';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { baptismDocumentService } from '../services/documentService';
// import { toast } from '../components/ui/use-toast';

const Baptism = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    try {
      await baptismDocumentService.create(data);
      queryClient.invalidateQueries({ queryKey: ['baptismDocuments'] });
    //   toast({
    //     title: "Success",
    //     description: "Baptism record has been created successfully",
    //   });
    } catch (error) {
      console.error('Error creating baptism record:', error);
    //   toast({
    //     title: "Error",
    //     description: "Failed to create baptism record",
    //     variant: "destructive",
    //   });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
          <BaptismForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Baptism;
