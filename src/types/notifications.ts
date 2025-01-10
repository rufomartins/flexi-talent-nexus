export enum TalentNotificationType {
  STATUS_CHANGE = 'STATUS_CHANGE',
  ASSIGNMENT_UPDATE = 'ASSIGNMENT_UPDATE',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  DUO_PARTNER_CHANGE = 'DUO_PARTNER_CHANGE',
  PROJECT_ASSIGNED = 'PROJECT_ASSIGNED',
  BOOKING_UPDATE = 'BOOKING_UPDATE'
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
}