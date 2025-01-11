// First, define base notification types that match Supabase exactly
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
  user_id: string; // Changed from userId to match database convention
  status?: string;
  deadlines?: {
    start: string;
    due: string;
  };
}

export interface NotificationPreferencesDB {
  talent_id: string;
  email_enabled?: boolean;
  in_app_enabled?: boolean;
  email_frequency?: EmailFrequency;
  reminder_days?: number[];
  types?: DatabaseNotificationType[];
  created_at?: string;
  updated_at?: string;
}

export type EmailFrequency = 'realtime' | 'daily' | 'weekly';

// Helper function for type conversion
export const convertToDbType = (type: NotificationType): DatabaseNotificationType => {
  return type as DatabaseNotificationType;
};