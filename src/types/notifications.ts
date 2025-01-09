export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export enum NotificationType {
  NEW_ASSIGNMENT = 'NEW_ASSIGNMENT',
  STATUS_CHANGE = 'STATUS_CHANGE',
  DEADLINE_WARNING = 'DEADLINE_WARNING',
  DEADLINE_OVERDUE = 'DEADLINE_OVERDUE',
  DEADLINE_APPROACHING = 'DEADLINE_APPROACHING',
  DEADLINE_MISSED = 'DEADLINE_MISSED',
  ROLE_REASSIGNMENT = 'ROLE_REASSIGNMENT'
}

export interface NotificationContent {
  title: string;
  message: string;
  action?: {
    type: string;
    url: string;
  };
}

export interface NotificationMetadata {
  task_id: string;
  role_type: 'translator' | 'reviewer' | 'ugc_talent';
  content: NotificationContent;
}

export interface Notification {
  id: string;
  type: NotificationType;
  user_id: string;
  status: 'pending' | 'sent' | 'read';
  metadata: NotificationMetadata;
  created_at: string;
  processed_at?: string;
}