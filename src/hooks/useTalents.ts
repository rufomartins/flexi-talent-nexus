import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SimplifiedTalent } from "@/types/talent";

export function useTalents(castingId?: string) {
  return useQuery<SimplifiedTalent[]>({
    queryKey: ['talents', castingId],
    queryFn: async () => {
      const { data, error } = await supabase
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
          casting_talents!left (
            id,
            casting_id
          ),
          users!inner (
            id,
            full_name,
            avatar_url
          ),
          partner:partner_id (
            id,
            user_id,
            first_name,
            last_name,
            full_name,
            email,
            avatar_url
          )
        `);

      if (error) {
        console.error('Error loading talents:', error.message);
        throw error;
      }

      return data.map(talent => ({
        ...talent,
        users: talent.users || { 
          id: talent.user_id,
          full_name: 'Unknown',
          avatar_url: undefined
        },
        casting_talents: talent.casting_talents || [],
        partner: talent.partner || null
      })) as SimplifiedTalent[];
    }
  });
}