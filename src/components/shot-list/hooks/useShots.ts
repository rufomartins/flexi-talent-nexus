import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";
import type { Shot } from "@/types/shot-list";

export function useShots(shotListId: string) {
  // Set up realtime subscription
  useRealtimeSubscription(
    "shots", 
    (payload) => {
      // Invalidate and refetch shots when changes occur
      console.log("Shot updated:", payload);
    }
  );

  return useQuery({
    queryKey: ["shots", shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shots")
        .select("*")
        .eq("shot_list_id", shotListId)
        .order("sequence_order", { ascending: true });

      if (error) {
        notify.error("Failed to load shots");
        throw error;
      }

      return data as Shot[];
    },
  });
}