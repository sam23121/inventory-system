import { User } from './user';

export interface Schedule {
  id: number;
  date: string;
  description: string;
  type_id: number;
  shift_id: number;
  user_id: number;
  type: ScheduleType;
  shift: ScheduleShift;
  user: User;
  assigned_by_id?: number;
  approved_by_id?: number;
}

export interface ScheduleShift {
  id: number;
  name: string;
  start_time: string;  // Changed from Date to string
  end_time: string;    // Changed from Date to string
}

export interface ScheduleType {
  id: number;
  name: string;
}

export interface ScheduleFormData {
  userId: string;
  shiftId: string;
  date: Date;
  description: string;
  type: string;
}

export interface CreateScheduleDTO {
  user_id: number;
  shift_id: number;
  date: string;
  description: string;
  type_id: number;
  assigned_by_id?: number;
}

