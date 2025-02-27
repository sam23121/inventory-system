import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import DocumentList from "../components/documents/DocumentList";
import { TypeList } from "../components/types/TypeList";
import { documentService, documentTypeService } from "../services/documentService";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, AlertDescription } from "../components/ui/alert";

const Documents = () => {
  const queryClient = useQueryClient();

  const { data: documents, isLoading: documentsLoading, error: documentsError } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await documentService.getAll();
      return response.data;
    }
  });

  const { data: documentTypes, isLoading: typesLoading, error: typesError } = useQuery({
    queryKey: ['documentTypes'],
    queryFn: async () => {
      const response = await documentTypeService.getAll();
      return response.data;
    }
  });

  if (documentsLoading || typesLoading) return <div>Loading...</div>;
  if (documentsError || typesError) return <Alert variant="destructive"><AlertDescription>Failed to fetch data</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentList 
              documents={documents ?? []}
              documentTypes={documentTypes ?? []}
              onDocumentUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['documents'] });
                queryClient.invalidateQueries({ queryKey: ['documentTypes'] });
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Types</CardTitle>
          </CardHeader>
          <CardContent>
            <TypeList 
              title="Document Type" 
              service={documentTypeService} 
              items={documentTypes ?? []}
              onItemUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['documentTypes'] });
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;