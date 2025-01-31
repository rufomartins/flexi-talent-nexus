export interface GuestSelection {
  id: string;
  casting_id: string;
  talent_id: string;
  guest_id: string;
  preference_order?: number;
  comments?: string;
  status: string;
  liked: boolean;
  created_at: string;
  updated_at: string;
}