import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export interface ConflictingBooking {
  id: string;
  project_name: string;
  dates: {
    start: string;
    end: string;
  };
}

export interface TalentAvailability {
  talent_id: string;
  start_date: string;
  end_date: string;
  is_available: boolean;
  conflicting_bookings?: ConflictingBooking[];
}

export const checkTalentAvailability = async (
  talentId: string,
  startDate: Date,
  endDate: Date
): Promise<TalentAvailability> => {
  const formattedStartDate = format(startDate, "yyyy-MM-dd");
  const formattedEndDate = format(endDate, "yyyy-MM-dd");

  const { data: conflicts, error } = await supabase
    .from("bookings")
    .select(`
      id,
      details,
      start_date,
      end_date
    `)
    .eq("talent_id", talentId)
    .neq("status", "cancelled")
    .or(`start_date.lte.${formattedEndDate},end_date.gte.${formattedStartDate}`);

  if (error) {
    console.error("Error checking availability:", error);
    throw error;
  }

  const conflictingBookings = conflicts?.map(booking => ({
    id: booking.id,
    project_name: booking.details,
    dates: {
      start: format(new Date(booking.start_date), "yyyy-MM-dd"),
      end: format(new Date(booking.end_date), "yyyy-MM-dd")
    }
  }));

  return {
    talent_id: talentId,
    start_date: formattedStartDate,
    end_date: formattedEndDate,
    is_available: !conflicts || conflicts.length === 0,
    conflicting_bookings: conflictingBookings
  };
};