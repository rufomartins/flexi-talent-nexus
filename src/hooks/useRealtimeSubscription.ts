import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export const useRealtimeSubscription = <T>(
  channel: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE',
  callback: (payload: RealtimePostgresChangesPayload<T>) => void
) => {
  useEffect(() => {
    let subscription: RealtimeChannel;

    const setupSubscription = async () => {
      subscription = supabase
        .channel(channel)
        .on(
          'postgres_changes',
          {
            event: event,
            schema: 'public',
            table: channel
          },
          callback
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [channel, event, callback]);
};