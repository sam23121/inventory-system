import { User } from './user';
export interface Schedule {
  id: number;
  date: string;
  description: string;
  type_id: number;
  shift_id: number;
  schedule_type?: ScheduleType;
  shift?: ScheduleShift;
  user?: User;
  user_id: number;
  assigned_by_id?: number;
  approved_by_id?: number;
}

export interface ScheduleShift {
  id: number;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
}

export interface ScheduleType {
  id: number;
  name: string;
  description: string;
}

export interface ScheduleFormData {
  userId: string;
  shiftId: string;
  date: Date;
  description: string;
  type: string;
}

