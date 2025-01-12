import type { Json } from '@/integrations/supabase/types';

export interface DuoPartner {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url?: string;
}

export type TalentCategory = 'UGC' | 'TRANSLATOR' | 'REVIEWER' | 'VOICE_OVER';

export interface TalentProfile {
  id: string;
  user_id: string | null;
  talent_category: TalentCategory;
  country: string | null;
  evaluation_status: string | null;
  is_duo: boolean | null;
  duo_name?: string | null;
  partner_id?: string | null;
  created_at: string | null;
  updated_at: string | null;
  agent_id: string | null;
  availability: Json | null;
  category: string | null;
  experience_level: string | null;
  fee_range: Json | null;
  native_language: string | null;
  partner?: DuoPartner;
  users: {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar_url?: string;
  };
}