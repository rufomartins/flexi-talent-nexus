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
          duo_name,
          created_at,
          updated_at,
          casting_talents!left (
            id,
            casting_id,
            castings (
              name
            )
          ),
          users!inner (
            id,
            full_name,
            avatar_url
          ),
          partner:talent_profiles!talent_profiles_partner_id_fkey (
            id,
            user_id,
            users (
              id,
              full_name,
              avatar_url
            )
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
        partner: talent.partner ? {
          ...talent.partner,
          full_name: talent.partner.users?.full_name || 'Unknown Partner',
        } : null
      })) as SimplifiedTalent[];
    }
  });
}