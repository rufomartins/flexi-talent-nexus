export interface DuoPartner {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
}

export interface TalentProfile {
  id: string;
  user_id: string;
  category: string | null;
  talent_category: 'UGC' | 'TRANSLATOR' | 'REVIEWER' | 'VOICE_OVER';
  country: string;
  evaluation_status: 'under_evaluation' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  is_duo: boolean;
  partner_id?: string;
  duo_name?: string;
  partner?: DuoPartner;
  users?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}