import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type TalentCategory = Database["public"]["Enums"]["talent_category"];

interface SimplifiedTalent {
  id: string;
  user_id: string;
  talent_category: TalentCategory;
  country: string;
  evaluation_status: string;
  is_duo: boolean;
  created_at: string;
  updated_at: string;
  agent_id?: string;
  availability: Record<string, any>;
  native_language: string;
  experience_level: string;
  fee_range: Record<string, any> | null;
  users: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  casting_talents: Array<{
    castings: {
      name: string;
    };
  }>;
}

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

      return (data || []) as SimplifiedTalent[];
    }
  });
}