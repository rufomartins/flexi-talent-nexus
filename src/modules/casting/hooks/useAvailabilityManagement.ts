import { supabase } from '@/integrations/supabase/client';
import type { TalentAvailability } from '../types';

export const useAvailabilityManagement = (castingId: string) => {
  const requestAvailability = async (talentId: string, dates: Date[]) => {
    try {
      const { data, error } = await supabase
        .from('casting_talents')
        .update({ 
          availability_status: 'pending',
          dates: dates.map(date => ({
            from: date.toISOString(),
            to: date.toISOString()
          }))
        })
        .eq('casting_id', castingId)
        .eq('talent_id', talentId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error requesting availability:', error);
      throw error;
    }
  };

  const updateAvailability = async (
    talentId: string, 
    status: 'available' | 'unavailable', 
    details: Partial<TalentAvailability>
  ) => {
    try {
      const { data, error } = await supabase
        .from('casting_talents')
        .update({ 
          availability_status: status,
          talent_fee: details.proposedFee,
          remarks: details.response,
          ...details
        })
        .eq('casting_id', castingId)
        .eq('talent_id', talentId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    }
  };

  return {
    requestAvailability,
    updateAvailability
  };
};