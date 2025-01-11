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

export type EmailFrequency = 'realtime' | 'daily' | 'weekly';

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
  user_id: string; // Changed from userId to match database
  status?: string;
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

export interface Notification {
  id: string;
  type: DatabaseNotificationType;
  metadata: NotificationMetadata;
  created_at: string;
}

// Helper function for type conversion
export const convertToDbType = (type: DatabaseNotificationType): DatabaseNotificationType => {
  return type;
};