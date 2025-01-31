import type { User as SupabaseUser } from '@supabase/supabase-js'
import { Database } from "@/integrations/supabase/types"

export type UserRole = Database["public"]["Enums"]["user_role"]
export type UserStatus = Database["public"]["Enums"]["user_status"]

export interface DatabaseUser {
  id: string;
  avatar_url: string | null;
  company_id: string | null;
  created_at: string;
  email: string;  // Changed from optional to required since we now sync it
  first_name: string | null;
  full_name: string | null;
  gender: string | null;
  last_login: string | null;
  last_name: string | null;
  mobile_phone: string | null;
  nationality: string | null;
  role: UserRole;
  status: UserStatus;
  phone_number_verified: boolean;
  sms_notifications_enabled: boolean;
  sms_notification_types: Database["public"]["Enums"]["notification_type"][];
}

export interface User extends SupabaseUser {
  role?: UserRole;
  status?: UserStatus;
}