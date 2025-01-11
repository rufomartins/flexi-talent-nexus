import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { BookingHeader } from "./BookingHeader";
import { TalentInfo } from "./TalentInfo";
import { ProjectInfo } from "./ProjectInfo";
import { FileSection } from "./FileSection";
import { ActivityTimeline } from "./ActivityTimeline";
import { useToast } from "@/hooks/use-toast";
import type { BookingStatus } from "@/types/booking";
import type { BookingDetailsData } from "./types";

interface BookingDetailsProps {
  bookingId: string;
}

export function BookingDetails({ bookingId }: BookingDetailsProps) {
  const { toast } = useToast();

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          talent_profiles (
            id,
            users (
              id,
              full_name,
              email,
              avatar_url
            )
          ),
          projects (
            name,
            description
          ),
          booking_files (
            id,
            file_name,
            file_type,
            file_path,
            created_at
          )
        `)
        .eq("id", bookingId)
        .single();

      if (error) throw error;
      return data as unknown as BookingDetailsData;
    },
  });

  const handleStatusUpdate = async (newStatus: BookingStatus) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Booking status has been updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load booking details
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-6 space-y-8">
      <BookingHeader booking={booking} onStatusUpdate={handleStatusUpdate} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <ProjectInfo booking={booking} />
          <FileSection bookingId={bookingId} files={booking.booking_files} />
          <ActivityTimeline bookingId={bookingId} />
        </div>
        
        <div className="space-y-6">
          <TalentInfo booking={booking} />
        </div>
      </div>
    </div>
  );
}