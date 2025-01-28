import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TalentProfile } from "@/types/talent";

export function useTalents(castingId: string) {
  return useQuery({
    queryKey: ['casting-talents', castingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_profiles')
        .select(`
          *,
          users:user_id (
            id,
            full_name,
            avatar_url
          ),
          casting_talents!inner (
            castings (
              name
            )
          )
        `)
        .eq('casting_id', castingId);

      if (error) throw error;

      return data.map(talent => ({
        id: talent.id,
        user_id: talent.user_id,
        talent_category: talent.talent_category || 'UGC',
        country: talent.country || '',
        evaluation_status: talent.evaluation_status || 'under_evaluation',
        is_duo: talent.is_duo || false,
        created_at: talent.created_at,
        updated_at: talent.updated_at,
        agent_id: talent.agent_id,
        availability: talent.availability || {},
        category: talent.category,
        experience_level: talent.experience_level || 'beginner',
        fee_range: talent.fee_range || null,
        native_language: talent.native_language || '',
        duo_name: talent.duo_name,
        partner_id: talent.partner_id,
        users: talent.users || { id: '', full_name: '', avatar_url: null },
        casting_talents: talent.casting_talents?.map(ct => ({
          castings: {
            name: ct.castings?.name || ''
          }
        })) || []
      })) as TalentProfile[];
    }
  });
}