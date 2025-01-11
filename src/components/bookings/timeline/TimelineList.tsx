import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { TimelineEvent } from '@/types/supabase';
import { TimelineEventItem } from './TimelineEventItem';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TimelineListProps {
  bookingId: string;
}

export const TimelineList: React.FC<TimelineListProps> = ({ bookingId }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
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

      if (error) {
        toast({
          title: "Error fetching timeline",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setEvents(data as TimelineEvent[]);
      setIsLoading(false);
    };

    fetchEvents();

    // Set up real-time subscription
    const channel = supabase
      .channel(`booking-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'booking_timeline_events',
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEvents((prev) => [(payload.new as TimelineEvent), ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No activity recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {events.map((event) => (
        <TimelineEventItem key={event.id} event={event} />
      ))}
    </div>
  );
};