import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTalentNotes = (shotListId: string) => {
  return useQuery({
    queryKey: ['talent-notes', shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_notes')
        .select('*')
        .eq('shot_list_id', shotListId);

      if (error) throw error;
      return data;
    },
  });
};