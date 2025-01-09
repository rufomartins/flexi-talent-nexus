import { DeadlineStatus, NotificationChannel } from './notifications';

export interface DeadlinePreference {
  id: string;
  user_id: string;
  warning_days: number[];
  notification_channels: NotificationChannel[];
  deadline_statuses: DeadlineStatus[];
  created_at: string;
  updated_at: string;
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