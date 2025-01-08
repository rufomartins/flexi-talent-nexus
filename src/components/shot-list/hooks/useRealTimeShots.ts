import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";
import { RealtimeChannel } from "@supabase/supabase-js";

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
      .subscribe((status) => {
        if (status === "SUBSCRIPTION_ERROR") {
          console.error("Error subscribing to shots changes");
          notify.error("Failed to subscribe to real-time updates");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shotListId, queryClient]);
};