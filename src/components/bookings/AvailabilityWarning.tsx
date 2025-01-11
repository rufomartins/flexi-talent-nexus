import React from "react";
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
import { ConflictingBooking } from "@/utils/availability";
import { format } from "date-fns";

interface AvailabilityWarningProps {
  conflicts: ConflictingBooking[];
  onProceed: () => void;
  onCancel: () => void;
  open: boolean;
}

export function AvailabilityWarning({
  conflicts,
  onProceed,
  onCancel,
  open
}: AvailabilityWarningProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Booking Date Conflict</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-4">
              <p>
                The selected dates conflict with existing bookings for this talent:
              </p>
              <ul className="list-disc pl-4 space-y-2">
                {conflicts.map((conflict) => (
                  <li key={conflict.id} className="text-sm">
                    <span className="font-medium">{conflict.project_name}</span>
                    <br />
                    <span className="text-muted-foreground">
                      {format(new Date(conflict.dates.start), "MMM d, yyyy")} -{" "}
                      {format(new Date(conflict.dates.end), "MMM d, yyyy")}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">
                Do you want to proceed with creating this booking anyway?
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onProceed}>
            Proceed Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}