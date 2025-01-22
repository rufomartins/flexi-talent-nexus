import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLoadingState } from './useLoadingState';
import { notify } from '@/utils/notifications';
import type { TalentNote } from '@/types/shot-list';

interface UseTalentNotesResult {
  notes: TalentNote[];
  isLoading: boolean;
  error: Error | null;
  loadingStates: Record<string, boolean>;
  addNote: (note: Partial<TalentNote>) => Promise<void>;
  updateNote: (id: string, note: Partial<TalentNote>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export function useTalentNotes(shotListId: string): UseTalentNotesResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['talent-notes', shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_notes')
        .select('*')
        .eq('shot_list_id', shotListId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TalentNote[];
    }
  });

  const { loadingStates, startLoading, stopLoading } = useLoadingState();

  const addNote = async (note: Partial<TalentNote>): Promise<void> => {
    try {
      startLoading('add');
      const { error } = await supabase
        .from('talent_notes')
        .insert([{ ...note, shot_list_id: shotListId }]);

      if (error) throw error;
      notify.success('Note added successfully');
      await refetch();
    } catch (error) {
      notify.error('Failed to add note');
      throw error;
    } finally {
      stopLoading('add');
    }
  };

  const updateNote = async (id: string, note: Partial<TalentNote>): Promise<void> => {
    try {
      startLoading('edit');
      const { error } = await supabase
        .from('talent_notes')
        .update(note)
        .eq('id', id);

      if (error) throw error;
      notify.success('Note updated successfully');
      await refetch();
    } catch (error) {
      notify.error('Failed to update note');
      throw error;
    } finally {
      stopLoading('edit');
    }
  };

  const deleteNote = async (id: string): Promise<void> => {
    try {
      startLoading('delete');
      const { error } = await supabase
        .from('talent_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      notify.success('Note deleted successfully');
      await refetch();
    } catch (error) {
      notify.error('Failed to delete note');
      throw error;
    } finally {
      stopLoading('delete');
    }
  };

  return {
    notes: data || [],
    isLoading,
    error,
    loadingStates,
    addNote,
    updateNote,
    deleteNote
  };
}