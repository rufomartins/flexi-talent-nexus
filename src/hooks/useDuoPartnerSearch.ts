import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { DuoPartner } from "@/types/talent";

interface UserWithProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
  talent_profiles: {
    id: string;
    user_id: string;
  }[];
}

export function useDuoPartnerSearch(query: string, currentTalentId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DuoPartner[]>([]);

  useEffect(() => {
    const searchTalents = async () => {
      if (!query) {
        setData([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('talent_profiles')
          .select(`
            id,
            user_id,
            users!talent_profiles_user_id_fkey (
              id,
              full_name,
              avatar_url
            )
          `)
          .or(`users.full_name.ilike.%${query}%,users.email.ilike.%${query}%`)
          .not('id', 'eq', currentTalentId)
          .limit(5);

        if (error) throw error;

        if (!data) {
          setData([]);
          return;
        }

        const partners: DuoPartner[] = data.map(profile => ({
          id: profile.id,
          user_id: profile.user_id,
          users: {
            id: profile.users.id,
            full_name: profile.users.full_name || '',
            avatar_url: profile.users.avatar_url
          }
        }));

        setData(partners);
      } catch (err) {
        console.error("Error searching talents:", err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(searchTalents, 300);
    return () => clearTimeout(timeoutId);
  }, [query, currentTalentId]);

  return { data, isLoading, error };
}