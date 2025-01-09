// Define our own Json type since Supabase's isn't available
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

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
  user_id: string;
  type: 'assignment' | 'status_change' | 'deadline_reminder' | 'overdue';
  status: 'pending' | 'sent' | 'read';
  created_at: string;
  processed_at: string | null;
  metadata: NotificationMetadata;
}

export interface NotificationInsert {
  type: string;
  user_id: string;
  status: 'pending' | 'sent' | 'read';
  metadata: Record<string, any>; // This maps to Supabase's Json type
}