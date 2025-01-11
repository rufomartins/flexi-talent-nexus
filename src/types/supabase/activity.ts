/** Event types that can occur in the system */
export type TimelineEventType = 
  | 'status_change' 
  | 'file_upload' 
  | 'comment' 
  | 'email_sent'
  | 'booking_created'
  | 'booking_updated';

export interface TimelineEventDetails {
  from?: string;  // For status changes
  to?: string;    // For status changes
  previous_status?: string;
  new_status?: string;
  file_name?: string;
  comment_text?: string;
  email_template_id?: string;
  changes?: Record<string, any>;
}

/** Timeline event record */
export interface TimelineEvent {
  id: string;
  booking_id: string;
  type: TimelineEventType;
  user_id: string;
  details: TimelineEventDetails;
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}