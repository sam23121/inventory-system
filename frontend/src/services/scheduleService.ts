import { Schedule, CreateScheduleDTO } from '../types/schedule';
import { api } from './api';

export const scheduleService = {
  getAll: () => api.get<Schedule[]>('/schedules'),
  getById: (id: number) => api.get<Schedule>(`/schedules/${id}`),
  create: (data: CreateScheduleDTO) => api.post<Schedule>('/schedules', data),
  update: (id: number, data: Partial<Schedule>) => api.put<Schedule>(`/schedules/${id}`, data),
  delete: (id: number) => api.delete(`/schedules/${id}`),
  approve: (id: number, approverId: number) => api.post<Schedule>(`/schedules/${id}/approve`, { approverId }),
  reject: (id: number, approverId: number) => api.post<Schedule>(`/schedules/${id}/reject`, { approverId }),
  getByUser: (userId: number) => api.get<Schedule[]>(`/schedules/user/${userId}`),
  getByDate: (date: string) => api.get<Schedule[]>(`/schedules/date/${date}`),
  getShifts: () => api.get('/schedules/shifts/'),
  getScheduleTypes: () => api.get('/schedules/types/'),
};