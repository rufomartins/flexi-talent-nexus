import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TalentProfile } from "@/types/talent";
import { toast } from "sonner";

const transformTalentData = (data: any[]): TalentProfile[] => {
  return data.map(item => ({
    id: item.talent_profiles.id,
    user_id: item.talent_profiles.user_id,
    talent_category: item.talent_profiles.talent_category,
    country: item.talent_profiles.country,
    native_language: item.talent_profiles.native_language,
    evaluation_status: item.talent_profiles.evaluation_status || 'under_evaluation',
    is_duo: item.talent_profiles.is_duo || false,
    created_at: item.talent_profiles.created_at,
    updated_at: item.talent_profiles.updated_at,
    agent_id: item.talent_profiles.agent_id,
    availability: item.talent_profiles.availability || null,
    category: item.talent_profiles.category,
    experience_level: item.talent_profiles.experience_level || 'beginner',
    fee_range: item.talent_profiles.fee_range || null,
    users: {
      id: item.talent_profiles.user.id,
      full_name: item.talent_profiles.user.full_name,
      avatar_url: item.talent_profiles.user.avatar_url
    },
    casting_talents: item.casting_talents || []
  }));
};

export function useTalents(castingId: string) {
  return useQuery({
    queryKey: ['casting-talents', castingId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('casting_talents')
          .select(`
            talent_profiles!inner (
              id,
              user_id,
              talent_category,
              country,
              native_language,
              evaluation_status,
              is_duo,
              created_at,
              updated_at,
              agent_id,
              availability,
              category,
              experience_level,
              fee_range,
              user:user_id (
                id,
                full_name,
                avatar_url
              )
            ),
            castings (
              name
            )
          `)
          .eq('casting_id', castingId);

        if (error) throw error;
        return transformTalentData(data || []);
      } catch (error) {
        toast.error('Failed to fetch talents');
        throw error;
      }
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
}