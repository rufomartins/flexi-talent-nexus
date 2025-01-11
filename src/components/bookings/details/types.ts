import type { Database } from "@/integrations/supabase/types";
import type { BookingStatus } from "@/types/booking";

export interface BookingDetailsData extends Database['public']['Tables']['bookings']['Row'] {
  talent_profiles: {
    id: string;
    users: {
      id: string;
      full_name: string;
      email: string;
      avatar_url?: string;
    };
  };
  projects: {
    name: string;
    description: string;
  } | null;
  booking_files: {
    id: string;
    file_name: string;
    file_type: string;
    file_path: string;
    created_at: string;
  }[];
}

export interface TimelineEvent {
  id: string;
  type: 'status_change' | 'file_upload' | 'comment' | 'email_sent';
  timestamp: string;
  user: {
    id: string;
    name: string;
  };
  details: Record<string, any>;
}