import { Database } from "@/integrations/supabase/types"

export type Booking = Database['public']['Tables']['bookings']['Row'] & {
  castings: {
    name: string | null
  } | null
  projects: {
    name: string | null
  } | null
  talent_profiles: {
    id: string
    user_id: string
    users: {
      id: string
      full_name: string | null
    } | null
  } | null
}