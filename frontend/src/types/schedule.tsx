export interface Schedule {
    id: number;
    date: string;
    description: string;
    type: string;
    user_id: number;
    assigned_by_id?: number;
    approved_by_id?: number;
    shift?: string;
  }
  