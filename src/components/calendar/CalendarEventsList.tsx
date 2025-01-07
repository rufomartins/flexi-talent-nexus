import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface CalendarEvent {
  id: string;
  date: string;
  description: string;
  casting_id: string | null;
  castings?: {
    name: string;
  } | null;
}

interface CalendarEventsListProps {
  events: CalendarEvent[];
  selectedDate: Date;
}

export function CalendarEventsList({ events, selectedDate }: CalendarEventsListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const filteredEvents = events.filter(
    (event) => format(new Date(event.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const handleDelete = async (eventId: string) => {
    const { error } = await supabase
      .from('talent_calendar')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Could not delete event",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Event deleted successfully",
    });

    queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
  };

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No events scheduled for this date
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredEvents.map((event) => (
        <div
          key={event.id}
          className="flex items-start justify-between p-4 rounded-lg border bg-card"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {event.casting_id ? (
                <Clock className="h-4 w-4 text-blue-500" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              <p className="font-medium">
                {event.casting_id
                  ? `Casting: ${event.castings?.name}`
                  : "Personal Event"}
              </p>
            </div>
            <p className="text-sm text-gray-500">{event.description}</p>
          </div>
          {!event.casting_id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(event.id)}
            >
              Delete
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}