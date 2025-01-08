import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";

export function useRealTimeShots(shotListId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`shots-changes-${shotListId}`)
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
          notify.error("Failed to subscribe to shots real-time updates");
        }
        
        if (status === REALTIME_SUBSCRIBE_STATES.CLOSED) {
          console.error("Shots subscription closed");
          notify.error("Real-time updates disconnected for shots");
        }

        if (status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT) {
          console.error("Shots subscription timed out");
          notify.error("Real-time updates connection timed out for shots");
        }
      });

    return () => {
      supabase.removeChannel(channel).then(() => {
        console.log("Shots subscription cleaned up");
      }).catch(error => {
        console.error("Error cleaning up shots subscription:", error);
      });
    };
  }, [shotListId, queryClient]);
}