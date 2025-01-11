export enum NotificationType {
  STATUS_CHANGE = 'STATUS_CHANGE',
  ASSIGNMENT_UPDATE = 'ASSIGNMENT_UPDATE',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  DUO_PARTNER_CHANGE = 'DUO_PARTNER_CHANGE',
  PROJECT_MILESTONE = 'PROJECT_MILESTONE',
  PAYMENT_STATUS = 'PAYMENT_STATUS',
  CASTING_OPPORTUNITY = 'CASTING_OPPORTUNITY',
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  REVIEW_FEEDBACK = 'REVIEW_FEEDBACK',
  DOCUMENT_UPDATE = 'DOCUMENT_UPDATE'
}

export type EmailFrequency = 'realtime' | 'daily' | 'weekly';

export interface NotificationPreferences {
  talent_id: string;
  email_enabled?: boolean;
  in_app_enabled?: boolean;
  types?: Array<keyof typeof NotificationType>;
  email_frequency?: EmailFrequency;
  reminder_days?: number[];
  created_at?: string;
  updated_at?: string;
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
