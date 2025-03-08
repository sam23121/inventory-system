import { Item, ItemType } from '../types/item';
import { api } from './api';

export const itemService = {
  getAll: () => api.get<Item[]>('/items/'),
  getById: (id: number) => api.get<Item>(`/items/${id}`),
  create: (data: Omit<Item, 'id'>) => api.post<Item>('/items', data),
  update: (id: number, data: Partial<Item>) => api.put<Item>(`/items/${id}`, data),
  delete: (id: number) => api.delete(`/items/${id}`),
  getTypes: () => api.get<ItemType[]>('/items/types/'),
};

export const itemTypeService = {
  getAll: () => api.get<ItemType[]>('/items/types/'),
  getById: (id: number) => api.get<ItemType>(`/items/types/${id}`),
  create: (data: Omit<ItemType, 'id'>) => api.post<ItemType>('/items/types', data),
  update: (id: number, data: Partial<ItemType>) => api.put<ItemType>(`/items/types/${id}`, data),
  delete: (id: number) => api.delete(`/items/types/${id}`),
};