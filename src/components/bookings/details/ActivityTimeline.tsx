import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { TimelineEvent } from "./types";

interface ActivityTimelineProps {
  bookingId: string;
}

export function ActivityTimeline({ bookingId }: ActivityTimelineProps) {
  const { data: events, isLoading } = useQuery({
    queryKey: ["booking-activity", bookingId],
    queryFn: async () => {
      // This is a placeholder - implement actual activity tracking
      const mockEvents: TimelineEvent[] = [
        {
          id: "1",
          type: "status_change",
          timestamp: new Date().toISOString(),
          user: {
            id: "1",
            name: "System",
          },
          details: {
            from: "pending",
            to: "confirmed",
          },
        },
      ];
      return mockEvents;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : events?.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No activity recorded yet
          </p>
        ) : (
          <div className="space-y-4">
            {events?.map((event) => (
              <div key={event.id} className="flex gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {event.type === "status_change" &&
                      `Status changed from ${event.details.from} to ${event.details.to}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    by {event.user.name} on{" "}
                    {new Date(event.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}