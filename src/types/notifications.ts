// Database notification types that match Supabase exactly
export type DatabaseNotificationType = 
  'STATUS_CHANGE' | 
  'PROFILE_UPDATE' | 
  'ASSIGNMENT_UPDATE' | 
  'DUO_PARTNER_CHANGE' | 
  'PROJECT_MILESTONE' |
  'PAYMENT_STATUS' |
  'CASTING_OPPORTUNITY' |
  'BOOKING_CONFIRMATION' |
  'REVIEW_FEEDBACK' |
  'DOCUMENT_UPDATE' |
  'NEW_ASSIGNMENT' |
  'DEADLINE_WARNING' |
  'DEADLINE_APPROACHING' |
  'DEADLINE_OVERDUE';

export enum NotificationType {
  STATUS_CHANGE = 'STATUS_CHANGE',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  ASSIGNMENT_UPDATE = 'ASSIGNMENT_UPDATE',
  DUO_PARTNER_CHANGE = 'DUO_PARTNER_CHANGE',
  PROJECT_MILESTONE = 'PROJECT_MILESTONE',
  PAYMENT_STATUS = 'PAYMENT_STATUS',
  CASTING_OPPORTUNITY = 'CASTING_OPPORTUNITY',
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  REVIEW_FEEDBACK = 'REVIEW_FEEDBACK',
  DOCUMENT_UPDATE = 'DOCUMENT_UPDATE',
  NEW_ASSIGNMENT = 'NEW_ASSIGNMENT',
  DEADLINE_WARNING = 'DEADLINE_WARNING',
  DEADLINE_APPROACHING = 'DEADLINE_APPROACHING',
  DEADLINE_OVERDUE = 'DEADLINE_OVERDUE'
}

export type EmailFrequency = 'realtime' | 'daily' | 'weekly';

export type NotificationChannel = 'email' | 'in_app' | 'sms';

export type DeadlineStatus = 'approaching' | 'overdue' | 'completed';

export interface NotificationMetadata {
  task_id?: string;
  role_type?: string;
  status?: string;
  content: {
    title: string;
    message: string;
    action?: {
      type: string;
      url: string;
    };
  };
}

export interface AssignmentData {
  task_id: string;
  role_type: string;
  user_id: string;
  status?: string;
  deadlines?: {
    start: string;
    due: string;
  };
}

export interface NotificationPreferences {
  talent_id: string;
  email_enabled?: boolean;
  in_app_enabled?: boolean;
  email_frequency?: EmailFrequency;
  reminder_days?: number[];
  types?: NotificationType[];
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  type: DatabaseNotificationType;
  metadata: NotificationMetadata;
  created_at: string;
}

export interface TalentNotification {
  id: string;
  talent_id: string;
  type: DatabaseNotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
  action_url?: string;
}

export interface DeadlinePreference {
  id: string;
  user_id: string;
  warning_days: number[];
  notification_channels: NotificationChannel[];
  deadline_statuses: DeadlineStatus[];
  created_at: string;
  updated_at: string;
}

// Helper function for type conversion
export const convertToDbType = (type: NotificationType): DatabaseNotificationType => {
  return type as DatabaseNotificationType;
};