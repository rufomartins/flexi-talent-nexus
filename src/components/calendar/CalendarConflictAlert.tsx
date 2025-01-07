import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { format, isWithinInterval, parseISO } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

export function CalendarConflictAlert() {
  const { user } = useAuth();
  const [conflicts, setConflicts] = useState<any[]>([]);

  const { data: events } = useQuery({
    queryKey: ['calendar-events', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_calendar')
        .select('*, castings(name)')
        .eq('talent_id', user?.id);

      if (error) {
        console.error('Error fetching calendar events:', error);
        return [];
      }

      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!events) return;

    const conflictingEvents = events.reduce((acc: any[], event) => {
      const date = parseISO(event.date);
      const overlappingEvents = events.filter(
        (e) => 
          e.id !== event.id && 
          format(parseISO(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );

      if (overlappingEvents.length > 0) {
        acc.push({
          date,
          events: [event, ...overlappingEvents],
        });
      }

      return acc;
    }, []);

    setConflicts(conflictingEvents);
  }, [events]);

  if (conflicts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 space-y-2">
      {conflicts.map((conflict, index) => (
        <Alert key={index} variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Schedule Conflict</AlertTitle>
          <AlertDescription>
            Multiple events scheduled for {format(conflict.date, 'MMMM d, yyyy')}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}