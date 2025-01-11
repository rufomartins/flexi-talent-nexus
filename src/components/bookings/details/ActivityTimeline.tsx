import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { TimelineEvent } from "@/types/supabase";
import { format } from "date-fns";

interface ActivityTimelineProps {
  bookingId: string;
}

export function ActivityTimeline({ bookingId }: ActivityTimelineProps) {
  const { data: events, isLoading } = useQuery({
    queryKey: ["booking-activity", bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_timeline_events')
        .select(`
          *,
          users (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TimelineEvent[];
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
                    by {event.users.full_name} on{" "}
                    {format(new Date(event.created_at), 'PPp')}
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