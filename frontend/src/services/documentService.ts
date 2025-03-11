import { get } from 'react-hook-form';
import { Document, DocumentType, ReligiousDocument, BaptismDocument, BurialDocument, MarriageDocument } from '../types/document';
import { api } from './api';

export const documentService = {
  getAll: () => api.get<Document[]>('/documents/'),
  getBaptismDocuments: () => api.get<Document[]>('/documents/baptism/'),
  getBurialDocuments: () => api.get<Document[]>('/documents/burial/'),
  getMarriageDocuments: () => api.get<Document[]>('/documents/marriage/'),
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

export const baptismDocumentService = {
  getAll: () => api.get<BaptismDocument[]>('/documents/baptism/'),
  getById: (id: number) => api.get<BaptismDocument>(`/documents/baptism/${id}`),
  create: (data: Omit<BaptismDocument, 'id'>) => api.post<BaptismDocument>('/documents/baptism/', data),
  update: (id: number, data: Partial<BaptismDocument>) => api.put<BaptismDocument>(`/documents/baptism/${id}`, data),
  delete: (id: number) => api.delete(`/documents/baptism/${id}`),
};

export const burialDocumentService = {
  getAll: () => api.get<BurialDocument[]>('/documents/burial/'),
  getById: (id: number) => api.get<BurialDocument>(`/documents/burial/${id}`),
  create: (data: Omit<BurialDocument, 'id'>) => api.post<BurialDocument>('/documents/burial/', data),
  update: (id: number, data: Partial<BurialDocument>) => api.put<BurialDocument>(`/documents/burial/${id}`, data),
  delete: (id: number) => api.delete(`/documents/burial/${id}`),
};

export const marriageDocumentService = {
  getAll: () => api.get<MarriageDocument[]>('/documents/marriage/'),
  getById: (id: number) => api.get<MarriageDocument>(`/documents/marriage/${id}`),
  create: (data: Omit<MarriageDocument, 'id'>) => api.post<MarriageDocument>('/documents/marriage/', data),
  update: (id: number, data: Partial<MarriageDocument>) => api.put<MarriageDocument>(`/documents/marriage/${id}`, data),
  delete: (id: number) => api.delete(`/documents/marriage/${id}`),
};

export const memberDocumentService = {
  getAll: () => api.get<ReligiousDocument[]>('/documents/member/'),
  getById: (id: number) => api.get<ReligiousDocument>(`/documents/member/${id}`),
  create: (data: Omit<ReligiousDocument, 'id'>) => api.post<ReligiousDocument>('/documents/member/', data),
  update: (id: number, data: Partial<ReligiousDocument>) => api.put<ReligiousDocument>(`/documents/member/${id}`, data),
  delete: (id: number) => api.delete(`/documents/member/${id}`),
};