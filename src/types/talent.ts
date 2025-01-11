export interface TalentProfile {
  id: string;
  user_id: string;
  talent_category: 'UGC' | 'TRANSLATOR' | 'REVIEWER' | 'VOICE_OVER';
  country: string;
  evaluation_status: 'approved' | 'under_evaluation' | 'rejected';
  is_duo: boolean;
  partner_id?: string;
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  partner?: {
    id: string;
    user_id: string;
    users: {
      full_name: string;
      avatar_url?: string;
    };
  };
}

export interface DuoPartner {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
}