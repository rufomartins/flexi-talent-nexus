import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";
import { RealtimeChannel, REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";

export const useRealTimeShots = (shotListId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel: RealtimeChannel = supabase
      .channel(`shots-${shotListId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shots",
          filter: `shot_list_id=eq.${shotListId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["shots", shotListId] });
        }
      )
      .subscribe((status, error) => {
        if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
          console.error("Error subscribing to shots changes:", error);
          notify.error("Failed to subscribe to real-time updates");
        }
        
        if (status === REALTIME_SUBSCRIBE_STATES.CLOSED) {
          console.error("Subscription closed");
          notify.error("Real-time updates disconnected");
        }

        if (status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT) {
          console.error("Subscription timed out");
          notify.error("Real-time updates connection timed out");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shotListId, queryClient]);
};