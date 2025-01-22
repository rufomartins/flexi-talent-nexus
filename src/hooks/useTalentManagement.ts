import { supabase } from '@/integrations/supabase/client';
import { TalentCategory } from '@/types/talent-management';
import { notify } from '@/utils/notifications';
import { useQuery } from '@tanstack/react-query';
import { useLoadingState } from './useLoadingState';

export const useTalentManagement = () => {
  const { loadingStates, startLoading, stopLoading } = useLoadingState();

  const { data: talents, isLoading, refetch } = useQuery({
    queryKey: ['talents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_profiles')
        .select(`
          *,
          users (
            id,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const bulkUpdateCategory = async (ids: string[], category: TalentCategory) => {
    try {
      startLoading('updateCategory');
      const { error } = await supabase
        .from('talent_profiles')
        .update({ talent_category: category })
        .in('id', ids);
      
      if (error) throw error;
      
      notify.success('Categories updated successfully');
      refetch();
      return true;
    } catch (error) {
      notify.error('Failed to update categories');
      return false;
    } finally {
      stopLoading('updateCategory');
    }
  };

  const updateTalentStatus = async (id: string, status: string) => {
    try {
      startLoading('updateStatus');
      const { error } = await supabase
        .from('talent_profiles')
        .update({ evaluation_status: status })
        .eq('id', id);

      if (error) throw error;

      notify.success('Status updated successfully');
      refetch();
      return true;
    } catch (error) {
      notify.error('Failed to update status');
      return false;
    } finally {
      stopLoading('updateStatus');
    }
  };

  const deleteTalent = async (id: string) => {
    try {
      startLoading('delete');
      const { error } = await supabase
        .from('talent_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      notify.success('Talent deleted successfully');
      refetch();
      return true;
    } catch (error) {
      notify.error('Failed to delete talent');
      return false;
    } finally {
      stopLoading('delete');
    }
  };

  return {
    talents,
    isLoading,
    loadingStates,
    bulkUpdateCategory,
    updateTalentStatus,
    deleteTalent,
  };
};