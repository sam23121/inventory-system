import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import DocumentList from "../components/documents/DocumentList";
import { TypeList } from "../components/types/TypeList";
import { Alert, AlertDescription } from "../components/ui/alert";
import { documentService, documentTypeService, baptismDocumentService, marriageDocumentService, burialDocumentService, memberDocumentService } from "../services/documentService";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LoadingProgress } from "../components/ui/loading-progress";
import { TableList } from "../components/table/TableList";
import { DocumentForm } from '../components/documents/DocumentForm';
import { TypeForm } from '../components/types/TypeForm';

const Documents = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: documents = [], isLoading: documentsLoading, error: documentsError } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await documentService.getAll();
      return response.data || [];
    }
  });

  const { data: baptismDocuments, isLoading: baptismDocumentsLoading, error: baptismDocumentsError } = useQuery({
    queryKey: ['baptismDocuments'],
    queryFn: async () => {
      const response = await baptismDocumentService.getAll();
      return response.data;
    }
  });

  const { data: BurialDocuments, isLoading: BurialDocumentsLoading, error: BurialDocumentsError } = useQuery({
    queryKey: ['BurialDocuments'],
    queryFn: async () => {
      const response = await burialDocumentService.getAll();
      return response.data;
    }
  });

  const { data: marriageDocuments, isLoading: marriageDocumentsLoading, error: marriageDocumentsError } = useQuery({
    queryKey: ['marriageDocuments'],
    queryFn: async () => {
      const response = await marriageDocumentService.getAll();
      return response.data;
    }
  });

  const { data: memberDocuments, isLoading: memberDocumentsLoading, error: memberDocumentsError } = useQuery({
    queryKey: ['memberDocuments'],
    queryFn: async () => {
      const response = await memberDocumentService.getAll();
      return response.data;
    }
  });

  // documents are the concatenation of all document types
  const allDocuments = [
    // ...(documents ?? []),
    ...(baptismDocuments ?? []),
    ...(BurialDocuments ?? []),
    ...(marriageDocuments ?? []),
    ...(memberDocuments ?? [])
  ];


  const { data: documentTypes = [], isLoading: typesLoading, error: typesError } = useQuery({
    queryKey: ['documentTypes'],
    queryFn: async () => {
      const response = await documentTypeService.getAll();
      return response.data || [];
    }
  });

  const documentColumns = [
    { header: t("common.name"), 
      accessor: "name" },
    { header: t("common.serialNumber"), 
      accessor: "serial_number" },
    { header: t("documents.type"), 
      accessor: "doc_type.name" },
    { header: t("common.description"), 
      accessor: "description" },
    { header: t("common.quantity"),
      accessor: "quantity" },
    { 
      header: "Date Updated", 
      accessor: "date_updated",
      render: (item: any) => new Date(item.date_updated).toLocaleDateString()
    }
  ];

  const typeColumns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" }
  ];

  if (documentsLoading || typesLoading) return <LoadingProgress />;
  if (documentsError || typesError) return <Alert variant="destructive"><AlertDescription>Failed to fetch data</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('documents.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TableList 
              title="Document"
              items={documents}
              columns={documentColumns}
              Form={(props) => <DocumentForm {...props} documentTypes={documentTypes} />}
              service={documentService}
              onUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['documents'] });
                queryClient.invalidateQueries({ queryKey: ['documentTypes'] });
              }}
              searchFields={['name', 'description', 'serial_number']}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('documents.documentTypes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <TableList 
              title="Document Type"
              items={documentTypes}
              columns={typeColumns}
              Form={TypeForm}
              service={documentTypeService}
              onUpdate={() => {
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