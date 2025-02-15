// src/components/documents/DocumentList.tsx
import React, { useEffect, useState } from 'react';
import { Document, DocumentType } from '../../types/document';
import { documentService, documentTypeService } from '../../services/documentService';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { DocumentForm } from './DocumentForm';
import { Input } from '../ui/input';

export const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getAll();
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch documents');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentTypes = async () => {
    try {
      const response = await documentTypeService.getAll();
      setDocumentTypes(response.data);
    } catch (err) {
      console.error('Error fetching document types:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchDocumentTypes();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.delete(id);
        setDocuments(documents.filter(doc => doc.id !== id));
      } catch (err) {
        setError('Failed to delete document');
        console.error('Error deleting document:', err);
      }
    }
  };

  const handleEdit = (document: Document) => {
    setSelectedDocument(document);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data: Partial<Document>) => {
    try {
      if (selectedDocument?.id) {
        await documentService.update(selectedDocument.id, data);
        await fetchDocuments();
        setIsEditModalOpen(false);
        setSelectedDocument(null);
      }
    } catch (err) {
      setError('Failed to update document');
    }
  };

  const handleCreateSubmit = async (data: Partial<Document>) => {
    try {
      await documentService.create(data as Omit<Document, 'id'>);
      await fetchDocuments();
      setIsCreateModalOpen(false);
    } catch (err) {
      setError('Failed to create document');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Document
        </Button>
      </div>

      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Date Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell>{document.name}</TableCell>
                <TableCell>{document.type_id}</TableCell>
                <TableCell>{document.description}</TableCell>
                <TableCell>{document.quantity}</TableCell>
                <TableCell>
                  {new Date(document.date_updated).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(document)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(document.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          <DocumentForm
            initialData={selectedDocument || undefined}
            documentTypes={documentTypes}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Document</DialogTitle>
          </DialogHeader>
          <DocumentForm
            documentTypes={documentTypes}
            onSubmit={handleCreateSubmit}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentList;