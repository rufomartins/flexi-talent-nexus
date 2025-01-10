export interface TalentProfile {
  id: string;
  user_id: string;
  talent_category: 'UGC' | 'TRANSLATOR' | 'REVIEWER' | 'VOICE_OVER';
  country: string;
  native_language: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  is_duo: boolean;
  partner_id?: string;
  duo_name?: string;
  evaluation_status: 'approved' | 'under_evaluation' | 'rejected';
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
  partner?: {
    id: string;
    user_id: string;
    users: {
      first_name: string;
      last_name: string;
      email: string;
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