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
          .from('users')
          .select<string, UserWithProfile>(`
            id,
            first_name,
            last_name,
            email,
            avatar_url,
            talent_profiles!inner (
              id,
              user_id
            )
          `)
          .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
          .not('talent_profiles.id', 'eq', currentTalentId)
          .limit(5);

        if (error) throw error;

        if (!data) {
          setData([]);
          return;
        }

        const partners: DuoPartner[] = data.map(user => ({
          id: user.talent_profiles[0].id,
          user_id: user.id,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          email: user.email || '',
          avatar_url: user.avatar_url || undefined
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