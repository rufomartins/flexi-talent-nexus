import type { Database } from "@/integrations/supabase/types";

export type TalentCategory = Database["public"]["Enums"]["talent_category"];
export type TalentStatus = "approved" | "under_evaluation" | "rejected";

export interface DuoPartner {
  id: string;
  user_id: string;
  users?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface SimplifiedTalent {
  id: string;
  user_id: string;
  talent_category: TalentCategory;
  country: string;
  evaluation_status: TalentStatus;
  is_duo: boolean;
  created_at: string;
  updated_at: string;
  casting_talents: Array<{
    id: string;
    casting_id: string;
    castings?: {
      name: string;
    };
  }>;
  users: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  partner: DuoPartner | null;
  duo_name?: string;
}

export interface TalentProfile {
  id: string;
  user_id: string;
  talent_category: TalentCategory;
  country: string;
  evaluation_status: TalentStatus;
  is_duo: boolean;
  duo_name?: string;
  created_at: string;
  updated_at: string;
  casting_talents?: Array<{
    id: string;
    casting_id: string;
    castings?: {
      name: string;
    };
  }>;
  users: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  partner?: DuoPartner | null;
  native_language?: string;
  experience_level?: string;
  fee_range?: Record<string, any>;
}