import { User } from "./user";
import { Database } from "@/integrations/supabase/types";

export type TalentStatus = "approved" | "under_evaluation" | "rejected";

// Define the database User type that matches our Supabase schema
export type DatabaseUser = Database["public"]["Tables"]["users"]["Row"];

export interface TalentProfileData {
  user: DatabaseUser;
  talent_profile: {
    category: string | null;
    evaluation_status: TalentStatus | null;
    internal_remarks: string | null;
  };
}