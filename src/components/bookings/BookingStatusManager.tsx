import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "./status/StatusBadge";
import { StatusTransitionButton } from "./status/StatusTransitionButton";
import { StatusConfirmationDialog } from "./status/StatusConfirmationDialog";
import type { BookingStatus, validStatusTransitions } from "@/types/booking";

interface BookingStatusManagerProps {
  bookingId: string;
  currentStatus: BookingStatus;
  lastUpdated?: string;
}

const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
  'pending': ['confirmed', 'cancelled'],
  'confirmed': ['completed', 'cancelled'],
  'completed': [],
  'cancelled': []
};

export function BookingStatusManager({ bookingId, currentStatus, lastUpdated }: BookingStatusManagerProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(null);
  const { toast } = useToast();

  const updateStatus = useMutation({
    mutationFn: async (newStatus: BookingStatus) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: `Booking status has been updated to ${selectedStatus}`,
      });
      setIsConfirmOpen(false);
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    },
  });

  const handleStatusSelect = (status: BookingStatus) => {
    setSelectedStatus(status);
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (selectedStatus) {
      await updateStatus.mutate(selectedStatus);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={currentStatus} />
      
      {lastUpdated && (
        <span className="text-sm text-muted-foreground">
          Updated: {new Date(lastUpdated).toLocaleDateString()}
        </span>
      )}

      <StatusTransitionButton 
        currentStatus={currentStatus}
        onStatusChange={handleStatusSelect}
        allowedTransitions={allowedTransitions[currentStatus]}
        isLoading={updateStatus.isPending}
      />

      <StatusConfirmationDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
        currentStatus={currentStatus}
        newStatus={selectedStatus || currentStatus}
        isLoading={updateStatus.isPending}
      />
    </div>
  );
}