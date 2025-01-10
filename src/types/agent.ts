import { TalentProfile } from "./talent";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];
type UserStatus = Database["public"]["Enums"]["user_status"];

export interface AgentWithRelationships {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  company_id: string | null;
  role: UserRole;
  status: UserStatus;
  gender: string | null;
  mobile_phone: string | null;
  nationality: string | null;
  created_at: string | null;
  last_login: string | null;
  agent_talent_relationships?: Array<{
    talent_id: string;
    talent: {
      first_name: string | null;
      last_name: string | null;
    };
  }>;
}