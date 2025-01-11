import type { Database } from "@/integrations/supabase/types";

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking extends Database['public']['Tables']['bookings']['Row'] {
  talent_profiles?: {
    id: string;
    user_id: string;
    users: {
      id: string;
      full_name: string;
    };
  };
  projects?: {
    name: string;
  } | null;
  castings?: {
    name: string;
  } | null;
}

export const validStatusTransitions: Record<BookingStatus, BookingStatus[]> = {
  'pending': ['confirmed', 'cancelled'],
  'confirmed': ['completed', 'cancelled'],
  'completed': [],
  'cancelled': []
};

export function isValidStatusTransition(
  currentStatus: BookingStatus,
  newStatus: BookingStatus
): boolean {
  return validStatusTransitions[currentStatus].includes(newStatus);
}