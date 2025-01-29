import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TalentProfile } from "@/types/talent";

export function useTalents(castingId?: string) {
  return useQuery<TalentProfile[]>({
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
          users:user_id (
            id,
            full_name,
            avatar_url
          ),
          casting_talents (
            id,
            casting_id,
            castings (
              name
            )
          ),
          partner:partner_id (
            id,
            user_id,
            users:user_id (
              id,
              full_name,
              avatar_url
            )
          ),
          native_language,
          experience_level,
          fee_range,
          availability,
          category,
          whatsapp_number
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
          avatar_url: null
        },
        partner: talent.partner ? {
          id: talent.partner.id,
          user_id: talent.partner.user_id,
          users: talent.partner.users || {
            id: talent.partner.user_id,
            full_name: 'Unknown Partner',
            avatar_url: null
          }
        } : null,
        casting_talents: talent.casting_talents || []
      })) as TalentProfile[];
    }
  });
}