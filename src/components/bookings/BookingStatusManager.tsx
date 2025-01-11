import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

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

const statusColors: Record<BookingStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  confirmed: "default",
  completed: "default",
  cancelled: "destructive"
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

  const handleConfirm = () => {
    if (selectedStatus) {
      updateStatus.mutate(selectedStatus);
    }
  };

  const availableTransitions = allowedTransitions[currentStatus] || [];

  return (
    <div className="flex items-center gap-2">
      <Badge variant={statusColors[currentStatus]}>
        {currentStatus}
      </Badge>
      
      {lastUpdated && (
        <span className="text-sm text-muted-foreground">
          Updated: {new Date(lastUpdated).toLocaleDateString()}
        </span>
      )}

      {availableTransitions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              disabled={updateStatus.isPending}
            >
              {updateStatus.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableTransitions.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => handleStatusSelect(status)}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    currentStatus === status ? "opacity-100" : "opacity-0"
                  }`}
                />
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Booking Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the status from "{currentStatus}" to "{selectedStatus}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {updateStatus.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}