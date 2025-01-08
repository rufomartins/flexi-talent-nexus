import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/utils/notifications';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import type { TalentNote } from '@/types/shot-list';

export function useTalentNotes(shotListId: string) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    add: false,
    edit: false,
    delete: false
  });

  // Set up realtime subscription
  useRealtimeSubscription("talent_notes", shotListId, ["talent-notes", shotListId]);

  const { data: notes, isLoading: isLoadingNotes } = useQuery({
    queryKey: ['talent-notes', shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_notes')
        .select('*')
        .eq('shot_list_id', shotListId)
        .order('created_at', { ascending: false });

      if (error) {
        notify.error('Failed to load talent notes');
        throw error;
      }

      return data as TalentNote[];
    },
  });

  const addNote = async (formData: Partial<TalentNote>) => {
    if (!shotListId) return false;

    try {
      setIsLoading(prev => ({ ...prev, add: true }));
      const { error } = await supabase
        .from('talent_notes')
        .insert([{ ...formData, shot_list_id: shotListId }]);

      if (error) throw error;
      notify.success('Note added successfully');
      return true;
    } catch (error) {
      console.error('Error adding note:', error);
      notify.error('Failed to add note');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, add: false }));
    }
  };

  const updateNote = async (noteId: string, formData: Partial<TalentNote>) => {
    try {
      setIsLoading(prev => ({ ...prev, edit: true }));
      const { error } = await supabase
        .from('talent_notes')
        .update(formData)
        .eq('id', noteId);

      if (error) throw error;
      notify.success('Note updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      notify.error('Failed to update note');
      return false;
    } finally {
      setIsLoading(prev => ({ ...prev, edit: false }));
    }
  };

  const deleteNote = async (noteId: string): Promise<void> => {
    try {
      setIsLoading(prev => ({ ...prev, delete: true }));
      const { error } = await supabase
        .from('talent_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      notify.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      notify.error('Failed to delete note');
    } finally {
      setIsLoading(prev => ({ ...prev, delete: false }));
    }
  };

  return {
    notes,
    isLoading: isLoadingNotes,
    loadingStates: isLoading,
    addNote,
    updateNote,
    deleteNote
  };
}
