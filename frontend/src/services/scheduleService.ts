import { Schedule, ScheduleType, ScheduleShift } from '../types/schedule';
import { api } from './api';

export const scheduleService = {
  getAll: () => api.get<Schedule[]>('/schedules/'),
  getById: (id: number) => api.get<Schedule>(`/schedules/${id}`),
  create: (data: Omit<Schedule, 'id'>) => api.post<Schedule>('/schedules', data),
  update: (id: number, data: Partial<Schedule>) => api.put<Schedule>(`/schedules/${id}`, data),
  delete: (id: number) => api.delete(`/schedules/${id}`),
  approve: (id: number, approverId: number) => api.post<Schedule>(`/schedules/${id}/approve`, { approverId }),
  reject: (id: number, approverId: number) => api.post<Schedule>(`/schedules/${id}/reject`, { approverId }),
  getByUser: (userId: number) => 
    api.get<Schedule[]>(`/schedules/user/${userId}`),
  getByDate: (date: string) => 
    api.get<Schedule[]>(`/schedules/date/${date}`),
  getShifts: () => api.get('/shifts'),
  getCurrentUserSchedules: () => {
    return api.get('/schedules/me');
  },
};

export const scheduleShiftService = {
  getAll: () => api.get('/schedules/shifts/'),
  getById: (id: number) => api.get(`/schedules/shifts/${id}`),
  create: (data: Omit<ScheduleShift, 'id'>) => api.post('/schedules/shifts', data),
  update: (id: number, data: Partial<Schedule>) => api.put(`/schedules/shifts/${id}`, data),
  delete: (id: number) => api.delete(`/schedules/shifts/${id}`),
};

export const scheduleTypeService = {
  getAll: () => api.get('/schedules/types/'),
  getById: (id: number) => api.get(`/schedules/types/${id}`),
  create: (data: Omit<ScheduleType, 'id'>) => api.post('/schedules/types/', data),
  update: (id: number, data: Partial<Schedule>) => api.put(`/schedules/types/${id}`, data),
  delete: (id: number) => api.delete(`/schedules/types/${id}`),
};