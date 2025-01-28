export interface SimplifiedTalent {
  id: string;
  user_id: string;
  talent_category: string;
  country: string;
  evaluation_status: string;
  is_duo: boolean;
  created_at: string;
  updated_at: string;
  casting_talents: Array<{
    id: string;
    casting_id: string;
  }>;
  users: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}