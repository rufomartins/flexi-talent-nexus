import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";
import { Shot } from "@/types/shot-list";

export const useShots = (shotListId: string) => {
  const queryClient = useQueryClient();

  const { data: shots, isLoading } = useQuery({
    queryKey: ["shots", shotListId],
    queryFn: async () => {
      const { data: shots, error } = await supabase
        .from("shots")
        .select(`
          *,
          location:locations (
            id,
            name
          )
        `)
        .eq("shot_list_id", shotListId)
        .order("sequence_order", { ascending: true });

      if (error) {
        notify.error("Failed to load shots");
        throw error;
      }

      return shots as Shot[];
    },
  });

  return { shots, isLoading };
};