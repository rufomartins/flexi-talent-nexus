import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { BookingFormData } from "@/components/bookings/types";
import { useToast } from "@/hooks/use-toast";

export function useBookingMutation(talentId: string, onSuccess?: () => void) {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const bookingData = {
        status: 'pending' as const,
        start_date: format(data.start_date, "yyyy-MM-dd"),
        end_date: format(data.end_date, "yyyy-MM-dd"),
        talent_fee: data.talent_fee,
        final_fee: data.final_fee,
        details: data.project_details,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        talent_id: talentId,
      };

      const { data: booking, error } = await supabase
        .from("bookings")
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;
      return booking;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Booking created successfully",
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive",
      });
    },
  });

  return {
    createBooking: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error as Error | null,
  };
}