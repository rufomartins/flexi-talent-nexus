import type { TalentCategory } from './supabase/talent';
import type { DuoPartner } from './talent-profile';

export type { DuoPartner };
export type { TalentCategory };

export interface TalentProfile {
  id: string;
  user_id: string;
  talent_category: TalentCategory;
  country: string;
  evaluation_status: string | null;
  is_duo: boolean;
  duo_name?: string | null;
  partner_id?: string | null;
  created_at: string | null;
  updated_at: string;
  agent_id: string | null;
  availability: Record<string, any> | null;
  category: string | null;
  experience_level: string;
  fee_range: Record<string, any> | null;
  native_language: string | null;
  partner?: DuoPartner;
  users: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}