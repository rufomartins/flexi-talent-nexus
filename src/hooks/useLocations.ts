import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/utils/notifications';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import type { Location, Shot } from '@/types/shot-list';

export function useLocations(shotListId: string) {
  // Set up realtime subscription
  useRealtimeSubscription<{ type: string; record: Location }>(
    "locations",
    shotListId,
    (payload) => {
      // Invalidate and refetch locations when changes occur
      console.log("Location updated:", payload);
    }
  );

  return useQuery({
    queryKey: ["locations", shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("shot_list_id", shotListId)
        .order("created_at", { ascending: true });

      if (error) {
        notify.error("Failed to load locations");
        throw error;
      }

      return data as Location[];
    },
  });
}
