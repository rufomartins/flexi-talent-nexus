import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarIcon, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth";
import { AddEventDialog } from "@/components/calendar/AddEventDialog";
import { CalendarEventsList } from "@/components/calendar/CalendarEventsList";
import { CalendarConflictAlert } from "@/components/calendar/CalendarConflictAlert";

interface CalendarEvent {
  id: string;
  date: string;
  description: string;
  casting_id: string | null;
  castings?: {
    name: string;
  } | null;
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: events, isLoading } = useQuery({
    queryKey: ['calendar-events', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_calendar')
        .select('id, date, description, casting_id')
        .eq('talent_id', user?.id);

      if (error) {
        console.error('Error fetching calendar events:', error);
        toast({
          title: "Error",
          description: "Could not load calendar events",
          variant: "destructive",
        });
        return [];
      }

      // If we need casting info, fetch it separately for valid casting_ids
      const eventsWithCastings = await Promise.all(
        data.map(async (event) => {
          if (event.casting_id) {
            const { data: castingData } = await supabase
              .from('castings')
              .select('name')
              .eq('id', event.casting_id)
              .single();
            
            return {
              ...event,
              castings: castingData || null
            };
          }
          return {
            ...event,
            castings: null
          };
        })
      );

      return eventsWithCastings as CalendarEvent[];
    },
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Calendar</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setDate(new Date())}
          >
            Today
          </Button>
          <Button onClick={() => setShowAddEvent(true)}>
            Add Event
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 gap-px border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="px-4 py-3 text-sm font-semibold text-gray-900 text-center"
            >
              {day}
            </div>
          ))}
        </div>
        
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          className="w-full border-none"
          components={{
            IconLeft: () => <ChevronLeft className="h-4 w-4" />,
            IconRight: () => <ChevronRight className="h-4 w-4" />,
          }}
        />

        <div className="p-4 border-t">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-4">
                Events for {format(date, 'MMMM d, yyyy')}
              </h2>
              <CalendarEventsList 
                events={events || []} 
                selectedDate={date}
              />
            </>
          )}
        </div>
      </div>

      <AddEventDialog 
        open={showAddEvent} 
        onOpenChange={setShowAddEvent}
      />

      <CalendarConflictAlert />
    </div>
  );
}