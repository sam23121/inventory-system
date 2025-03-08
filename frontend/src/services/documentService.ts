import { Document, DocumentType } from '../types/document';
import { api } from './api';

export const documentService = {
  getAll: () => api.get<Document[]>('/documents/'),
  getById: (id: number) => api.get<Document>(`/documents/${id}`),
  create: (data: Omit<Document, 'id'>) => api.post<Document>('/documents', data),
  update: (id: number, data: Partial<Document>) => api.put<Document>(`/documents/${id}`, data),
  delete: (id: number) => api.delete(`/documents/${id}`),
  getTypes: () => api.get<DocumentType[]>('/documents/types/'),
};

export const documentTypeService = {
  getAll: () => api.get<DocumentType[]>('/documents/types/'),
  getById: (id: number) => api.get<DocumentType>(`/documents/types/${id}`),
  create: (data: Omit<DocumentType, 'id'>) => api.post<DocumentType>('/documents/types/', data),
  update: (id: number, data: Partial<DocumentType>) => api.put<DocumentType>(`/documents/types/${id}`, data),
  delete: (id: number) => api.delete(`/documents/types/${id}`),
};