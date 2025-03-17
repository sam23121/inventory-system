import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BaptismForm from '../../components/forms/BaptismForm';
import { BaptismDocument } from '../../types/document';
import { User } from '../../types/user';
import { baptismDocumentService } from '../../services/documentService';
import { userService } from '../../services/userService';
import { useSnackbar } from 'notistack';

// Import shadcui components
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Loader2 } from "lucide-react";

const BaptismRegistrationPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  // Fetch priests list using React Query
  const { data: priests = [], isLoading, error: priestsError } = useQuery<User[], Error>({
    queryKey: ['priests'],
    queryFn: async () => {
      const response = await userService.getByType('Priest');
      return response || [];
    }
  });

  console.log(priests);

  const handleSubmit = async (data: BaptismDocument) => {
    setError(null);

    // Format dates for API submission if needed
    const formattedData = {
      ...data,
      date_of_birth: data.date_of_birth instanceof Date 
        ? data.date_of_birth
        : data.date_of_birth,
      baptism_date: data.baptism_date instanceof Date 
        ? data.baptism_date
        : data.baptism_date
    };
    baptismDocumentService.create(formattedData)
        .then(() => {
            enqueueSnackbar('Baptism certificate registered successfully', { variant: 'success' });
            navigate('/documents/baptism');
            }
        )
        .catch((error) => {
            setError('An error occurred. Please try again.');
        }
    );
  };

  // Combined error from different sources
  const displayError = error || (priestsError ? 'Error fetching priest data' : null);

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Register New Baptism Certificate</CardTitle>
            <p className="text-muted-foreground">
              Complete the form below to register a new baptism certificate in the system.
            </p>
          </CardHeader>
        </Card>

        {displayError && (
          <Alert variant="destructive">
            <AlertDescription>
              {displayError}
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <BaptismForm 
            onSubmit={handleSubmit} 
            priests={priests} 
            isLoading={false}
          />
        )}
      </div>
    </div>
  );
};

export default BaptismRegistrationPage;
