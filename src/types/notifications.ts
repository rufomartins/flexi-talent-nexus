export enum NotificationType {
  DEADLINE_APPROACHING = 'DEADLINE_APPROACHING',
  DEADLINE_OVERDUE = 'DEADLINE_OVERDUE',
  STATUS_CHANGE = 'STATUS_CHANGE',
  NEW_ASSIGNMENT = 'NEW_ASSIGNMENT',
  DEADLINE_WARNING = 'DEADLINE_WARNING',
  ASSIGNMENT_UPDATE = 'ASSIGNMENT_UPDATE',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  DUO_PARTNER_CHANGE = 'DUO_PARTNER_CHANGE',
  PROJECT_ASSIGNED = 'PROJECT_ASSIGNED',
  BOOKING_UPDATE = 'BOOKING_UPDATE',
  PROJECT_MILESTONE = 'PROJECT_MILESTONE',
  PAYMENT_STATUS = 'PAYMENT_STATUS',
  CASTING_OPPORTUNITY = 'CASTING_OPPORTUNITY',
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  REVIEW_FEEDBACK = 'REVIEW_FEEDBACK',
  DOCUMENT_UPDATE = 'DOCUMENT_UPDATE'
}

export type TalentNotificationType = keyof typeof NotificationType;

export enum DeadlineStatus {
  APPROACHING = 'approaching',
  OVERDUE = 'overdue'
}

export enum NotificationChannel {
  EMAIL = 'email',
  IN_APP = 'in_app'
}

export interface NotificationMetadata {
  task_id?: string;
  role_type?: string;
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
  talent_id: string;
  type: TalentNotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  metadata: Record<string, any>;
  action_url?: string;
}

export interface NotificationPreferences {
  talent_id: string;
  email_enabled: boolean;
  in_app_enabled: boolean;
  types: TalentNotificationType[];
  email_frequency: 'realtime' | 'daily' | 'weekly';
  reminder_days: number[];
  created_at?: string;
  updated_at?: string;
}