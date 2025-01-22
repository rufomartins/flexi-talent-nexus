import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export const useRealtimeSubscription = <T>(
  channel: string,
  event: string,
  callback: (payload: T) => void
) => {
  useEffect(() => {
    let subscription: RealtimeChannel;

    const setupSubscription = async () => {
      subscription = supabase
        .channel(channel)
        .on('presence', { event }, callback)
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Subscribed to ${channel}`);
          }
          if (status === 'CLOSED') {
            console.log(`Subscription to ${channel} closed`);
          }
          if (status === 'CHANNEL_ERROR') {
            console.error(`Error in channel ${channel}`);
          }
        });
    };

    setupSubscription();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [channel, event, callback]);
};