import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { GuestSelection } from '@/types/supabase/guest-selection';

interface SelectionManagementOptions {
  castingId: string;
  guestId: string;
  onError?: (error: Error) => void;
}

interface UseSelectionManagement {
  updateSelection: (talentId: string, update: Partial<GuestSelection>) => Promise<void>;
  updateMultipleSelections: (updates: Record<string, Partial<GuestSelection>>) => Promise<void>;
  reorderSelections: (newOrder: Record<string, number>) => Promise<void>;
  removeSelection: (talentId: string) => Promise<void>;
  isUpdating: Record<string, boolean>;
  error: Error | null;
}

export function useSelectionManagement({
  castingId,
  guestId,
  onError
}: SelectionManagementOptions): UseSelectionManagement {
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  const updateSelection = async (talentId: string, update: Partial<GuestSelection>) => {
    setIsUpdating(prev => ({ ...prev, [talentId]: true }));
    try {
      const { data, error } = await supabase
        .from('guest_selections')
        .upsert({
          talent_id: talentId,
          guest_id: guestId,
          casting_id: castingId,
          ...update,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      queryClient.setQueryData(
        ['guest-selections', castingId, guestId],
        (old: Record<string, GuestSelection> = {}) => ({
          ...old,
          [talentId]: data
        })
      );

      toast.success('Selection updated');
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
      toast.error('Failed to update selection');
    } finally {
      setIsUpdating(prev => ({ ...prev, [talentId]: false }));
    }
  };

  const updateMultipleSelections = async (updates: Record<string, Partial<GuestSelection>>) => {
    const talentIds = Object.keys(updates);
    talentIds.forEach(id => setIsUpdating(prev => ({ ...prev, [id]: true })));

    try {
      const { data, error } = await supabase
        .from('guest_selections')
        .upsert(
          Object.entries(updates).map(([talentId, update]) => ({
            talent_id: talentId,
            guest_id: guestId,
            casting_id: castingId,
            ...update,
            updated_at: new Date().toISOString()
          }))
        )
        .select();

      if (error) throw error;

      queryClient.setQueryData(
        ['guest-selections', castingId, guestId],
        (old: Record<string, GuestSelection> = {}) => ({
          ...old,
          ...Object.fromEntries(data.map(item => [item.talent_id, item]))
        })
      );

      toast.success('Selections updated');
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
      toast.error('Failed to update selections');
    } finally {
      talentIds.forEach(id => 
        setIsUpdating(prev => ({ ...prev, [id]: false }))
      );
    }
  };

  const reorderSelections = async (newOrder: Record<string, number>) => {
    return updateMultipleSelections(
      Object.entries(newOrder).reduce((acc, [talentId, order]) => ({
        ...acc,
        [talentId]: { preference_order: order }
      }), {})
    );
  };

  const removeSelection = async (talentId: string) => {
    setIsUpdating(prev => ({ ...prev, [talentId]: true }));
    try {
      const { error } = await supabase
        .from('guest_selections')
        .delete()
        .match({ talent_id: talentId, guest_id: guestId, casting_id: castingId });

      if (error) throw error;

      queryClient.setQueryData(
        ['guest-selections', castingId, guestId],
        (old: Record<string, GuestSelection> = {}) => {
          const { [talentId]: removed, ...rest } = old;
          return rest;
        }
      );

      toast.success('Selection removed');
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
      toast.error('Failed to remove selection');
    } finally {
      setIsUpdating(prev => ({ ...prev, [talentId]: false }));
    }
  };

  return {
    updateSelection,
    updateMultipleSelections,
    reorderSelections,
    removeSelection,
    isUpdating,
    error
  };
}