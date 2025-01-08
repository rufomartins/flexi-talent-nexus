import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/utils/notifications';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import type { Equipment, EquipmentFormData } from '@/types/equipment';

export function useEquipment(shotListId: string) {
  const [loadingStates, setLoadingStates] = useState({
    add: false,
    edit: false,
    delete: false
  });

  // Set up realtime subscription
  useRealtimeSubscription("equipment", shotListId, ["equipment", shotListId]);

  const { data: equipment, isLoading } = useQuery({
    queryKey: ['equipment', shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('shot_list_id', shotListId)
        .order('created_at', { ascending: false });

      if (error) {
        notify.error('Failed to load equipment');
        throw error;
      }

      return data as Equipment[];
    },
  });

  const addEquipment = async (formData: EquipmentFormData): Promise<boolean> => {
    if (!shotListId) return false;

    try {
      setLoadingStates(prev => ({ ...prev, add: true }));
      const { error } = await supabase
        .from('equipment')
        .insert([{ ...formData, shot_list_id: shotListId }]);

      if (error) throw error;
      notify.success('Equipment added successfully');
      return true;
    } catch (error) {
      console.error('Error adding equipment:', error);
      notify.error('Failed to add equipment');
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, add: false }));
    }
  };

  const updateEquipment = async (id: string, formData: EquipmentFormData): Promise<boolean> => {
    try {
      setLoadingStates(prev => ({ ...prev, edit: true }));
      const { error } = await supabase
        .from('equipment')
        .update(formData)
        .eq('id', id);

      if (error) throw error;
      notify.success('Equipment updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating equipment:', error);
      notify.error('Failed to update equipment');
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, edit: false }));
    }
  };

  const deleteEquipment = async (id: string): Promise<void> => {
    try {
      setLoadingStates(prev => ({ ...prev, delete: true }));
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (error) throw error;
      notify.success('Equipment deleted successfully');
    } catch (error) {
      console.error('Error deleting equipment:', error);
      notify.error('Failed to delete equipment');
    } finally {
      setLoadingStates(prev => ({ ...prev, delete: false }));
    }
  };

  return {
    equipment,
    isLoading,
    loadingStates,
    addEquipment,
    updateEquipment,
    deleteEquipment
  };
}
