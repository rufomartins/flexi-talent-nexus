import { Database } from "@/integrations/supabase/types";

export type TalentRole = Database["public"]["Enums"]["user_role"];
export type TalentStatus = "approved" | "under_evaluation" | "rejected";

export interface TalentProfileData {
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    gender: string | null;
    mobile_phone: string | null;
    nationality: string | null;
    avatar_url: string | null;
    created_at: string | null;
    updated_at: string | null;
    role: Database["public"]["Enums"]["user_role"];
    status: Database["public"]["Enums"]["user_status"];
    full_name: string | null;
  };
  talent_profile: {
    category: string | null;
    evaluation_status: TalentStatus | null;
    internal_remarks: string | null;
  };
}