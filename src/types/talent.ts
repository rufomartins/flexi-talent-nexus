import type { Database } from "@/integrations/supabase/types";

export type TalentCategory = Database["public"]["Enums"]["talent_category"];
export type TalentStatus = "approved" | "under_evaluation" | "rejected";

export interface TalentUser {
  id: string;
  full_name: string;
  avatar_url?: string | null;
}

export interface CastingReference {
  id: string;
  casting_id: string;
  castings?: {
    name: string;
  } | null;
}

export interface DuoPartner {
  id: string;
  user_id: string;
  users: TalentUser;
}

export interface TalentProfile {
  id: string;
  user_id: string;
  talent_category: TalentCategory;
  country: string;
  evaluation_status: TalentStatus;
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