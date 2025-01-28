import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TalentProfile } from "@/types/talent";

export function useTalents(castingId: string) {
  return useQuery({
    queryKey: ['casting-talents', castingId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('talent_profiles')
          .select(`
            *,
            users!talent_profiles_user_id_fkey (
              id,
              full_name,
              avatar_url
            ),
            casting_talents!talent_id (
              castings (
                name
              )
            )
          `)
          .eq('casting_id', castingId);

        if (error) throw error;

        const transformedData = (data || []).map(talent => ({
          id: talent.id,
          user_id: talent.user_id,
          talent_category: talent.talent_category || 'UGC',
          country: talent.country || '',
          evaluation_status: talent.evaluation_status || 'under_evaluation',
          is_duo: talent.is_duo || false,
          created_at: talent.created_at,
          updated_at: talent.updated_at,
          agent_id: talent.agent_id,
          availability: talent.availability || null,
          category: talent.category,
          experience_level: talent.experience_level || 'beginner',
          fee_range: talent.fee_range || null,
          native_language: talent.native_language || '',
          duo_name: talent.duo_name,
          partner_id: talent.partner_id,
          users: {
            id: talent.users?.id || '',
            full_name: talent.users?.full_name || '',
            avatar_url: talent.users?.avatar_url
          },
          casting_talents: talent.casting_talents?.map(ct => ({
            castings: {
              name: ct.castings?.name || ''
            }
          })) || []
        })) as TalentProfile[];

        return transformedData;
      } catch (error) {
        console.error('Error fetching talents:', error);
        throw error;
      }
    }
  });
}