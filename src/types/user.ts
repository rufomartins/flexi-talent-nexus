import { Database } from "@/integrations/supabase/types";

export type UserRole = Database["public"]["Enums"]["user_role"];
export type UserStatus = Database["public"]["Enums"]["user_status"];

export interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  gender: string | null;
  mobile_phone: string | null;
  nationality: string | null;
  avatar_url: string | null;
  created_at: string | null;
  last_login: string | null;
  role: UserRole;
  status: UserStatus;
  company_id?: string | null;
  full_name: string | null;
}