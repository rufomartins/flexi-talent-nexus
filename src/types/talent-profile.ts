import { Database } from "@/integrations/supabase/types";

export type TalentRole = "ugc_talent" | "translator" | "reviewer" | "voice_over_artist";
export type TalentStatus = "approved" | "under_evaluation" | "rejected";

export interface TalentProfileData {
  id: string;
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    gender: string | null;
    mobile_phone: string | null;
    nationality: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
    role: Database["public"]["Enums"]["user_role"];
    status: Database["public"]["Enums"]["user_status"];
  };
  talent_profile: {
    category: TalentRole | null;
    evaluation_status: TalentStatus;
    internal_remarks: string | null;
  };
}