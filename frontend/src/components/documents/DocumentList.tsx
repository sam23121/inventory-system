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
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../ui/pagination';
import { useTranslation } from 'react-i18next';


interface DocumentListProps {
  documents: Document[];
  documentTypes: DocumentType[];
  onDocumentUpdate: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({documents, documentTypes, onDocumentUpdate}) => {
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const ITEMS_PER_PAGE = 5;

  const {t} = useTranslation();




  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentService.delete(id);
        onDocumentUpdate();
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
        onDocumentUpdate();
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
      onDocumentUpdate();
      setIsCreateModalOpen(false);
    } catch (err) {
      setError('Failed to create document');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage
  } = usePagination({
    totalItems: filteredDocuments.length,
    itemsPerPage: ITEMS_PER_PAGE
  });

  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);


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
            placeholder={t('search') + '...'}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('documents.createDocument')}
        </Button>
      </div>

      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('common.name')}</TableHead>
              <TableHead>{t('common.type')}</TableHead>
              <TableHead>{t('common.description')}</TableHead>
              <TableHead>{t('common.quantity')}</TableHead>
              <TableHead>{t('common.dateUpdated')}</TableHead>
              <TableHead>{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDocuments.map((document) => (
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('documents.editDocument')}</DialogTitle>
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
            <DialogTitle>{t('documents.createDocument')}</DialogTitle>
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