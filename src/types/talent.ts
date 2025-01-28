export interface TalentUser {
  id: string;
  full_name: string;
  avatar_url?: string | null;
}

export interface DuoPartner {
  id: string;
  user_id: string;
  users: TalentUser;
}

export interface CastingReference {
  id: string;
  casting_id: string;
  castings?: {
    name: string;
  } | null;
}

export interface TalentProfile {
  id: string;
  user_id: string;
  talent_category: string;
  country: string;
  evaluation_status: string;
  is_duo: boolean;
  duo_name?: string | null;
  created_at: string;
  updated_at: string;
  casting_talents?: CastingReference[];
  users: TalentUser;
  partner?: DuoPartner | null;
  native_language?: string | null;
  experience_level?: string | null;
  fee_range?: Record<string, any>;
  availability?: Record<string, any> | null;
  category?: string | null;
  whatsapp_number?: string | null;
}