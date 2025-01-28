import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { SimplifiedTalent } from "@/types/talent";

type TalentCategory = Database["public"]["Enums"]["talent_category"];

export function useTalents(castingId?: string) {
  return useQuery<SimplifiedTalent[]>({
    queryKey: ['talents', castingId],
    queryFn: async () => {
      const query = supabase
        .from('talent_profiles')
        .select(`
          id,
          user_id,
          talent_category,
          country,
          evaluation_status,
          is_duo,
          created_at,
          updated_at,
          agent_id,
          availability,
          native_language,
          experience_level,
          fee_range,
          users (
            id,
            full_name,
            avatar_url
          ),
          casting_talents (
            castings (
              name
            )
          )
        `);

      if (castingId) {
        query.eq('casting_id', castingId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading talents:', error.message);
        throw error;
      }

      return data as SimplifiedTalent[];
    }
  });
}