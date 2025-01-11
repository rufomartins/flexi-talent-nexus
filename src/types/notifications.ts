// Database types that match Supabase schema
export type DatabaseNotificationType = 
  | 'STATUS_CHANGE'
  | 'PROFILE_UPDATE'
  | 'ASSIGNMENT_UPDATE'
  | 'DUO_PARTNER_CHANGE'
  | 'PROJECT_MILESTONE'
  | 'PAYMENT_STATUS'
  | 'CASTING_OPPORTUNITY'
  | 'BOOKING_CONFIRMATION'
  | 'REVIEW_FEEDBACK'
  | 'DOCUMENT_UPDATE'
  | 'NEW_ASSIGNMENT'
  | 'DEADLINE_WARNING'
  | 'DEADLINE_APPROACHING'
  | 'DEADLINE_OVERDUE';

// Enum that matches exactly with database types
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

export interface Notification {
  id: string;
  type: DatabaseNotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  talent_id: string;
  email_enabled?: boolean;
  in_app_enabled?: boolean;
  email_frequency?: string;
  reminder_days?: number[];
  types?: DatabaseNotificationType[];
  created_at?: string;
  updated_at?: string;
}

export interface TalentNotification {
  id: string;
  type: NotificationType;
  talent_id: string;
  title: string;
  message: string;
  metadata: Record<string, any>;
  read: boolean;
  created_at: string;
  updated_at: string;
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

export interface AssignmentData {
  task_id: string;
  role_type: string;
  user_id: string;
}

export enum DeadlineStatus {
  APPROACHING = 'APPROACHING',
  OVERDUE = 'OVERDUE'
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
  SMS = 'SMS'
}

// Helper function for type conversion
export const convertToDbType = (type: NotificationType): DatabaseNotificationType => {
  return type as DatabaseNotificationType;
};