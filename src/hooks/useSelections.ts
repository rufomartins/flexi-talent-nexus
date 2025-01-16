import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GuestSelection } from "@/types/supabase/guest-selection";

export function useSelections(castingId: string, guestId: string) {
  return useQuery({
    queryKey: ['guest-selections', castingId, guestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_selections')
        .select('*')
        .eq('casting_id', castingId)
        .eq('guest_id', guestId);

      if (error) throw error;

      return data.reduce((acc, selection) => ({
        ...acc,
        [selection.talent_id]: {
          id: selection.id,
          casting_id: selection.casting_id,
          talent_id: selection.talent_id,
          guest_id: selection.guest_id,
          preference_order: selection.preference_order,
          comments: selection.comments,
          liked: selection.liked || false,
          created_at: selection.created_at,
          updated_at: selection.updated_at,
          status: selection.status || 'shortlisted'
        } as GuestSelection,
      }), {} as Record<string, GuestSelection>);
    }
  });
}