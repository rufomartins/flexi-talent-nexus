import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BookingDetailsData } from "./types";

interface ProjectInfoProps {
  booking: BookingDetailsData;
}

export function ProjectInfo({ booking }: ProjectInfoProps) {
  if (!booking.projects) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">{booking.projects.name}</h3>
          <p className="text-sm text-muted-foreground">
            {booking.projects.description || "No description available"}
          </p>
        </div>

        {booking.details && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Additional Details</h4>
            <p className="text-sm text-muted-foreground">{booking.details}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}