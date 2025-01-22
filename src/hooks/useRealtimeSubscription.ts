import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeSubscription(
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE',
  callback: (payload: any) => void
) {
  useEffect(() => {
    let channel: RealtimeChannel;

    try {
      channel = supabase
        .channel('db-changes')
        .on(
          'postgres_changes',
          {
            event: event,
            schema: 'public',
            table: table
          },
          callback
        )
        .subscribe();
    } catch (error) {
      console.error('Error subscribing to realtime changes:', error);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, event, callback]);
}