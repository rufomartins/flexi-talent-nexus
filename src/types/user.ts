import type { User as SupabaseUser } from '@supabase/supabase-js'
import { Database } from "@/integrations/supabase/types"

export type UserRole = Database["public"]["Enums"]["user_role"]
export type UserStatus = Database["public"]["Enums"]["user_status"]

export interface User extends SupabaseUser {
  first_name?: string
  last_name?: string
  gender?: string
  mobile_phone?: string
  nationality?: string
  avatar_url?: string
  role?: UserRole
  status?: UserStatus
  company_id?: string
  full_name?: string
}