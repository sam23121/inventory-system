import { Transaction, TransactionType } from '../types/transaction';
import { api } from './api';

export const transactionService = {
  getAll: () => api.get<Transaction[]>('/transactions/'),
  getById: (id: number) => api.get<Transaction>(`/transactions/${id}`),
  create: (data: Omit<Transaction, 'id'>) => api.post<Transaction>('/transactions', data),
  update: (id: number, data: Partial<Transaction>) => api.put<Transaction>(`/transactions/${id}`, data),
  delete: (id: number) => api.delete(`/transactions/${id}`),
  getTypes: () => api.get<TransactionType[]>('/transactions/types'),
  approve: (id: number) => api.post<Transaction>(`/transactions/${id}/approve`),
  reject: (id: number) => api.post<Transaction>(`/transactions/${id}/reject`),
};

export const transactionTypeService = {
  getAll: () => api.get<TransactionType[]>('/transactions/types/'),
  getById: (id: number) => api.get<TransactionType>(`/transactions/types/${id}`),
  create: (data: Omit<TransactionType, 'id'>) => api.post<TransactionType>('/transactions/types', data),
  update: (id: number, data: Partial<TransactionType>) => api.put<TransactionType>(`/transactions/types/${id}`, data),
  delete: (id: number) => api.delete(`/transactions/types/${id}`),
};