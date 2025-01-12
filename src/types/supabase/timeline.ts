import { BaseRecord } from './base';

export type TimelineEventType = 
  | 'status_change'
  | 'file_upload'
  | 'comment'
  | 'email_sent'
  | 'booking_created'
  | 'booking_updated';

export interface TimelineEventDetails {
  previous_status?: string;
  new_status?: string;
  file_name?: string;
  comment_text?: string;
  email_template_id?: string;
  changes?: Record<string, any>;
}

export interface TimelineEvent extends BaseRecord {
  booking_id: string;
  event_type: TimelineEventType;
  user_id: string;
  details: TimelineEventDetails;
  users?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}