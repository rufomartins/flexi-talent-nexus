import { Database } from "@/integrations/supabase/types"

export type Booking = Database['public']['Tables']['bookings']['Row'] & {
  talent_profiles: {
    id: string
    user_id: string
    users: {
      id: string
      full_name: string
    }
  }
  projects: {
    name: string
  } | null
  castings: {
    name: string
  } | null
}