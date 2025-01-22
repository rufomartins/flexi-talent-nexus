import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLocations = (shotListId: string) => {
  return useQuery({
    queryKey: ['locations', shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('shot_list_id', shotListId);

      if (error) throw error;
      return data;
    },
  });
};