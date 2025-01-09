export interface NotificationMetadata {
  task_id: string;
  role_type: 'translator' | 'reviewer' | 'ugc_talent';
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
  user_id: string;
  type: 'assignment' | 'status_change' | 'deadline_reminder' | 'overdue';
  status: 'pending' | 'sent' | 'read';
  created_at: string;
  processed_at: string | null;
  metadata: NotificationMetadata;
}