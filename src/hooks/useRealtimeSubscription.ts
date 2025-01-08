import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";

export function useRealtimeSubscription(
  tableName: string,
  shotListId: string,
  queryKey: string[]
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`${tableName}-changes-${shotListId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: tableName,
          filter: `shot_list_id=eq.${shotListId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe((status, error) => {
        if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
          console.error(`Error subscribing to ${tableName} changes:`, error);
          notify.error(`Failed to subscribe to ${tableName} real-time updates`);
        }
        
        if (status === REALTIME_SUBSCRIBE_STATES.CLOSED) {
          console.error(`${tableName} subscription closed`);
          notify.error(`Real-time updates disconnected for ${tableName}`);
        }

        if (status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT) {
          console.error(`${tableName} subscription timed out`);
          notify.error(`Real-time updates connection timed out for ${tableName}`);
        }
      });

    return () => {
      supabase.removeChannel(channel).then(() => {
        console.log(`${tableName} subscription cleaned up`);
      }).catch(error => {
        console.error(`Error cleaning up ${tableName} subscription:`, error);
      });
    };
  }, [shotListId, queryClient, tableName, queryKey]);
}