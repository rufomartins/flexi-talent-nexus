import { supabase } from '@/integrations/supabase/client';
import type { ClientSelection } from '../types';

export const useClientSelection = (castingId: string) => {
  const updateSelection = async (
    talentId: string, 
    preference: number, 
    status: ClientSelection['status']
  ) => {
    try {
      const { data, error } = await supabase
        .from('guest_selections')
        .upsert({
          casting_id: castingId,
          talent_id: talentId,
          preference_order: preference,
          status: status
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating selection:', error);
      throw error;
    }
  };

  const finalizeSelections = async () => {
    try {
      const { data, error } = await supabase
        .from('castings')
        .update({ status: 'closed' })
        .eq('id', castingId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finalizing selections:', error);
      throw error;
    }
  };

  return {
    updateSelection,
    finalizeSelections
  };
};