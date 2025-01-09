export interface DeadlinePreference {
  id: string;
  user_id: string;
  warning_days: number[];
  notification_types: ('email' | 'in_app')[];
  created_at: string;
  updated_at: string;
}

export interface DeadlineCheck {
  taskId: string;
  roleType: 'translator' | 'reviewer' | 'ugc_talent';
  deadline: string;
  userId: string;
}

export interface AssignmentTracking {
  userId: string;
  taskId: string;
  roleType: 'translator' | 'reviewer' | 'ugc_talent';
  deadlines: {
    start: string;
    due: string;
  };
}