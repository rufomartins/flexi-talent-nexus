import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/utils/notifications';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import type { Location, Shot } from '@/types/shot-list';

export function useLocations(shotListId: string) {
  // Set up realtime subscription
  useRealtimeSubscription("locations", shotListId, ["locations", shotListId]);

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

  return {
    ...useQuery({
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
    }),
    checkLocationUsage,
    deleteLocation
  };
}