import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import type { Shot } from '@/types/shot-list';

export function useShots(shotListId: string) {
  const handleShotsUpdate = () => {
    // Invalidate and refetch shots when changes occur
    console.log("Shot updated");
  };

  useRealtimeSubscription('shots', 'UPDATE', handleShotsUpdate);

  return useQuery({
    queryKey: ['shots', shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shots')
        .select('*')
        .eq('shot_list_id', shotListId)
        .order('sequence_order', { ascending: true });

      if (error) throw error;
      return data as Shot[];
    }
  });
}