import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type SimplifiedTalent = {
  id: string;
  user_id: string;
  talent_category: string;
  country: string;
  evaluation_status: string;
  is_duo: boolean;
  created_at: string;
  updated_at: string;
  agent_id?: string;
  availability?: Record<string, any>;
  native_language?: string;
  experience_level: string;
  fee_range?: Record<string, any>;
  users: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  casting_talents?: Array<{
    castings: {
      name: string;
    };
  }>;
};

export function useTalents(castingId?: string) {
  return useQuery({
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
          users!talent_profiles_user_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          casting_talents!inner (
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

      return (data || []).map(talent => ({
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
        native_language: talent.native_language || '',
        experience_level: talent.experience_level || 'beginner',
        fee_range: talent.fee_range || null,
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
      })) as SimplifiedTalent[];
    }
  });
}