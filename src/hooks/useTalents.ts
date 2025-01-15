import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TalentProfile } from "@/types/talent";

const transformTalentData = (data: any[]): TalentProfile[] => {
  return data.map(item => ({
    id: item.talent_profiles.id,
    user_id: item.talent_profiles.user_id,
    talent_category: item.talent_profiles.talent_category,
    country: item.talent_profiles.country,
    native_language: item.talent_profiles.native_language,
    users: {
      id: item.talent_profiles.user.id,
      full_name: item.talent_profiles.user.full_name,
      avatar_url: item.talent_profiles.user.avatar_url
    }
  }));
};

export function useTalents(castingId: string) {
  return useQuery({
    queryKey: ['casting-talents', castingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('casting_talents')
        .select(`
          talent_profiles!inner (
            id,
            user_id,
            talent_category,
            country,
            native_language,
            user:user_id (
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('casting_id', castingId);

      if (error) throw error;
      return transformTalentData(data || []);
    }
  });
}