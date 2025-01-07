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
  const [view, setView] = useState<'month' | 'week'>('month');
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(date);
    if (direction === 'prev') {
      newDate.setMonth(date.getMonth() - 1);
    } else {
      newDate.setMonth(date.getMonth() + 1);
    }
    setDate(newDate);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 px-6 pt-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Calendar</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white rounded-lg shadow-sm border">
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-gray-50"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 font-medium">
              {format(date, 'MMMM yyyy')}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-gray-50"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center rounded-lg border shadow-sm overflow-hidden">
            <Button 
              variant="ghost"
              size="sm"
              className={`px-4 ${view === 'month' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setView('month')}
            >
              Month
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              className={`px-4 ${view === 'week' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
              onClick={() => setView('week')}
            >
              Week
            </Button>
          </div>
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

      <div className="flex-1 bg-white rounded-lg shadow mx-6 mb-6">
        <div className="grid grid-cols-7 gap-px border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="px-4 py-3 text-sm font-semibold text-gray-900 text-center bg-white"
            >
              {day}
            </div>
          ))}
        </div>
        
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          className="w-full border-none rounded-none"
          components={{
            IconLeft: () => <ChevronLeft className="h-4 w-4" />,
            IconRight: () => <ChevronRight className="h-4 w-4" />,
          }}
        />

        <div className="p-6 border-t">
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