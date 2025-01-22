import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/utils/notifications';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import type { Location, Shot } from '@/types/shot-list';

interface UseLocationsResult {
  data: Location[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  checkLocationUsage: (locationId: string) => Promise<Shot[]>;
  deleteLocation: (locationId: string) => Promise<void>;
}

export function useLocations(shotListId: string): UseLocationsResult {
  // Set up realtime subscription
  useRealtimeSubscription<{ type: string; record: Location }>(
    "locations",
    'UPDATE',
    (payload) => {
      // Invalidate and refetch locations when changes occur
      console.log("Location updated:", payload);
    }
  );

  const { data, isLoading, error, refetch: queryRefetch } = useQuery({
    queryKey: ["locations", shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("shot_list_id", shotListId)
        .order("created_at", { ascending: true });

      if (error) {
        notify.error("Failed to load locations");
        throw error;
      }

      return data as Location[];
    },
  });

  const checkLocationUsage = async (locationId: string): Promise<Shot[]> => {
    const { data, error } = await supabase
      .from('shots')
      .select('id, shot_number, description, shot_list_id, status, sequence_order')
      .eq('location_id', locationId);

    if (error) {
      console.error('Error checking location usage:', error);
      throw error;
    }

    return data || [];
  };

  const deleteLocation = async (locationId: string) => {
    try {
      // First, update any shots that reference this location
      const { error: shotsError } = await supabase
        .from('shots')
        .update({ location_id: null })
        .eq('location_id', locationId);

      if (shotsError) throw shotsError;

      // Then delete the location
      const { error: locationError } = await supabase
        .from('locations')
        .delete()
        .eq('id', locationId);

      if (locationError) throw locationError;
      
      notify.success('Location deleted successfully');
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  };

  const refetch = async () => {
    await queryRefetch();
  };

  return {
    data,
    isLoading,
    error,
    refetch,
    checkLocationUsage,
    deleteLocation
  };
}