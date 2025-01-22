import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/utils/notifications';
import type { Location } from '@/types/shot-list';

interface UseLocationsResult {
  data: Location[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  checkLocationUsage: (id: string) => Promise<Shot[]>;
  deleteLocation: (id: string) => Promise<void>;
}

export function useLocations(shotListId: string): UseLocationsResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['locations', shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('shot_list_id', shotListId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Location[];
    }
  });

  const checkLocationUsage = async (id: string): Promise<Shot[]> => {
    const { data, error } = await supabase
      .from('shots')
      .select('*')
      .eq('location_id', id);

    if (error) {
      notify.error('Failed to check location usage');
      throw error;
    }

    return data;
  };

  const deleteLocation = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) {
      notify.error('Failed to delete location');
      throw error;
    }

    notify.success('Location deleted successfully');
    await refetch();
  };

  return {
    data: data || [],
    isLoading,
    error,
    refetch,
    checkLocationUsage,
    deleteLocation
  };
}