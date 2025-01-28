import type { Database } from "@/integrations/supabase/types";

export type TalentCategory = Database["public"]["Enums"]["talent_category"];
export type TalentStatus = "approved" | "under_evaluation" | "rejected";

export interface TalentProfile {
  id: string;
  user_id: string;
  talent_category: TalentCategory;
  country: string;
  evaluation_status: TalentStatus;
  is_duo: boolean;
  created_at: string;
  updated_at: string;
  agent_id?: string;
  availability?: Record<string, any>;
  native_language?: string;
  experience_level?: string;
  fee_range?: Record<string, any>;
  duo_name?: string;
  partner_id?: string;
  partner?: DuoPartner;
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
  }>;
  users: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface DuoPartner {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email?: string;
  avatar_url?: string;
}