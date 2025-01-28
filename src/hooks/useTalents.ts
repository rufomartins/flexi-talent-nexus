import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TalentProfile } from "@/types/talent";
import { toast } from "sonner";

const transformTalentData = (data: any[]): TalentProfile[] => {
  return data.map(item => ({
    id: item.id,
    user_id: item.user_id,
    talent_category: item.talent_category,
    country: item.country,
    native_language: item.native_language,
    evaluation_status: item.evaluation_status || 'under_evaluation',
    is_duo: item.is_duo || false,
    created_at: item.created_at,
    updated_at: item.updated_at,
    agent_id: item.agent_id,
    availability: item.availability || null,
    category: item.category,
    experience_level: item.experience_level || 'beginner',
    fee_range: item.fee_range || null,
    users: {
      id: item.users.id,
      full_name: item.users.full_name,
      avatar_url: item.users.avatar_url
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
          .from('talent_profiles')
          .select(`
            *,
            users!inner (
              id,
              full_name,
              avatar_url
            ),
            casting_talents (
              castings (
                name
              )
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