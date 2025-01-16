export interface ShareLink {
  id: string;
  casting_id: string;
  guest_id: string;
  token: string;
  expires_at: string;
  allow_comments: boolean;
  readonly: boolean;
  created_at: string;
  created_by: string;
  casting?: {
    name: string;
  };
  guest?: {
    full_name: string;
  };
}