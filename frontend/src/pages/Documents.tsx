import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import DocumentList from "../components/documents/DocumentList";
import { TypeList } from "../components/types/TypeList";
import { documentService, documentTypeService } from "../services/documentService";
import { Document, DocumentType } from "../types/document";
import { useState, useEffect } from "react";

const Documents = () => {

  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fetchedDocumentsResponse, fetchedDocumentTypesResponse] = await Promise.all([
        documentService.getAll(),
        documentTypeService.getAll()
      ]);
      setDocuments(fetchedDocumentsResponse.data);
      setDocumentTypes(fetchedDocumentTypesResponse.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Documents Section */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentList 
            documents={documents}
            documentTypes={documentTypes}
            onDocumentUpdate={fetchData}
            />
          </CardContent>
        </Card>

        {/* Document Types Section */}
        <Card>
          <CardHeader>
            <CardTitle>Document Types</CardTitle>
          </CardHeader>
          <CardContent>
            <TypeList 
            title="Document Type" 
            service={documentTypeService} 
            items={documentTypes}
            onItemUpdate={() => {}}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documents;