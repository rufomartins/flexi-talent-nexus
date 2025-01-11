/** Event types that can occur in the system */
export type TimelineEventType = 'status_change' | 'file_upload' | 'comment' | 'email_sent';

/** Timeline event record */
export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  timestamp: string;
  user: {
    id: string;
    name: string;
  };
  details: Record<string, any>;
}