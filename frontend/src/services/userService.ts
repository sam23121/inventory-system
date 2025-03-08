import { User, UserType, Role } from '../types/user';
import { api } from './api';

export const userService = {
  getAll: () => api.get<User[]>('/users/'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (data: Omit<User, 'id'>) => api.post<User>('/users', data),
  update: (id: number, data: Partial<User>) => api.put<User>(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
  getTypes: () => api.get<UserType[]>('/users/types'),
  getRoles: () => api.get<Role[]>('/roles'),
  assignRole: (userId: number, roleId: number) => api.post(`/users/${userId}/roles/${roleId}`),
  removeRole: (userId: number, roleId: number) => api.delete(`/users/${userId}/roles/${roleId}`),
  uploadProfilePicture: (userId: number, file: File) => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    return api.post<User>(`/users/${userId}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const roleService = {
  getAll: () => api.get<Role[]>('/users/roles/'),
  getById: (id: number) => api.get<Role>(`/users/roles/${id}`),
  create: (data: Omit<Role, 'id'>) => api.post<Role>('/users/roles', data),
  update: (id: number, data: Partial<Role>) => api.put<Role>(`/roles/${id}`, data),
  delete: (id: number) => api.delete(`/users/roles/${id}`),
  getPermissions: (roleId: number) => api.get(`/roles/${roleId}/permissions`),
  assignPermission: (roleId: number, permissionId: number) => api.post(`/roles/${roleId}/permissions/${permissionId}`),
  removePermission: (roleId: number, permissionId: number) => api.delete(`/roles/${roleId}/permissions/${permissionId}`),
};

export const userTypeService = {
  getAll: () => api.get<UserType[]>('/users/types/'),
  getById: (id: number) => api.get<UserType>(`/users/types/${id}`),
  create: (data: Omit<UserType, 'id'>) => api.post<UserType>('/users/types', data),
  update: (id: number, data: Partial<UserType>) => api.put<UserType>(`/users/types/${id}`, data),
  delete: (id: number) => api.delete(`/users/types/${id}`),
  assignRole: (typeId: number, roleId: number) => api.put(`/users/types/${typeId}/roles/${roleId}`),
  removeRole: (typeId: number, roleId: number) => api.delete(`/users/types/${typeId}/roles/${roleId}`),
};