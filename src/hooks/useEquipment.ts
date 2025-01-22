import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Equipment, EquipmentFormData } from '@/types/equipment';
import { useLoadingState } from './useLoadingState';
import { notify } from '@/utils/notifications';

export function useEquipment(shotListId: string) {
  const { loadingStates, startLoading, stopLoading } = useLoadingState();

  const { data: equipment = [], isLoading, refetch } = useQuery({
    queryKey: ['equipment', shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('shot_list_id', shotListId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Equipment[];
    }
  });

  const addEquipment = async (formData: EquipmentFormData) => {
    try {
      startLoading('add');
      const { error } = await supabase
        .from('equipment')
        .insert([{ ...formData, shot_list_id: shotListId }]);

      if (error) throw error;
      notify.success('Equipment added successfully');
      refetch();
      return true;
    } catch (error) {
      notify.error('Failed to add equipment');
      return false;
    } finally {
      stopLoading('add');
    }
  };

  const updateEquipment = async (id: string, formData: EquipmentFormData) => {
    try {
      startLoading('edit');
      const { error } = await supabase
        .from('equipment')
        .update(formData)
        .eq('id', id);

      if (error) throw error;
      notify.success('Equipment updated successfully');
      refetch();
      return true;
    } catch (error) {
      notify.error('Failed to update equipment');
      return false;
    } finally {
      stopLoading('edit');
    }
  };

  const deleteEquipment = async (id: string) => {
    try {
      startLoading('delete');
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (error) throw error;
      notify.success('Equipment deleted successfully');
      refetch();
      return true;
    } catch (error) {
      notify.error('Failed to delete equipment');
      return false;
    } finally {
      stopLoading('delete');
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