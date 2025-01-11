export enum NotificationType {
  // Status notifications
  STATUS_CHANGE = 'STATUS_CHANGE',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  
  // Assignment notifications
  NEW_ASSIGNMENT = 'NEW_ASSIGNMENT',
  ASSIGNMENT_UPDATE = 'ASSIGNMENT_UPDATE',
  
  // Deadline notifications
  DEADLINE_WARNING = 'DEADLINE_WARNING',
  DEADLINE_APPROACHING = 'DEADLINE_APPROACHING',
  DEADLINE_OVERDUE = 'DEADLINE_OVERDUE',
  
  // Partner notifications
  DUO_PARTNER_CHANGE = 'DUO_PARTNER_CHANGE',
  
  // Project notifications
  PROJECT_ASSIGNED = 'PROJECT_ASSIGNED',
  PROJECT_MILESTONE = 'PROJECT_MILESTONE',
  
  // Payment notifications
  PAYMENT_STATUS = 'PAYMENT_STATUS',
  
  // Other notifications
  CASTING_OPPORTUNITY = 'CASTING_OPPORTUNITY',
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  REVIEW_FEEDBACK = 'REVIEW_FEEDBACK',
  DOCUMENT_UPDATE = 'DOCUMENT_UPDATE'
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

export type EmailFrequency = 'realtime' | 'daily' | 'weekly';

export interface NotificationMetadata {
  task_id: string;
  role_type: string;
  content: {
    title: string;
    message: string;
    action?: {
      type: string;
      url: string;
    };
  };
}

export interface Notification {
  id: string;
  type: NotificationType;
  user_id: string;
  status: 'pending' | 'sent';
  metadata: NotificationMetadata;
  processed_at?: string;
  created_at: string;
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

export interface NotificationPreferences {
  talent_id: string;
  email_enabled?: boolean;
  in_app_enabled?: boolean;
  types?: NotificationType[];
  email_frequency?: EmailFrequency;
  reminder_days?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface AssignmentData {
  task_id: string;
  role_type: string;
  user_id: string;
  status?: string;
}