import { Button } from "@/components/ui/button";
import { StatusBadge } from "../status/StatusBadge";
import { Edit, Trash } from "lucide-react";
import type { BookingStatus } from "@/types/booking";
import type { BookingDetailsData } from "./types";
import { format } from "date-fns";

interface BookingHeaderProps {
  booking: BookingDetailsData;
  onStatusUpdate: (newStatus: BookingStatus) => Promise<void>;
}

export function BookingHeader({ booking, onStatusUpdate }: BookingHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">
          {booking.projects?.name || "Untitled Project"}
        </h1>
        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
          <span>
            {format(new Date(booking.start_date), "MMM d, yyyy")} -{" "}
            {format(new Date(booking.end_date), "MMM d, yyyy")}
          </span>
          <StatusBadge status={booking.status} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm">
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}