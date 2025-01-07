import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoadingState } from '@/hooks/useLoadingState';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/utils/notifications';
import { TalentNoteForm } from './talent-notes/TalentNoteForm';
import { TalentNoteTable } from './talent-notes/TalentNoteTable';
import type { TalentNote } from '@/types/shot-list';

export function TalentNotesTab() {
  const { shotListId } = useParams<{ shotListId: string }>();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<TalentNote | null>(null);
  const { startLoading, stopLoading, isLoading } = useLoadingState({
    add: false,
    edit: false,
    delete: false,
  });

  // Add new note
  const handleAdd = async (formData: Partial<TalentNote>) => {
    if (!shotListId) return;

    try {
      startLoading('add');
      const { error } = await supabase
        .from('talent_notes')
        .insert([{ ...formData, shot_list_id: shotListId }]);

      if (error) throw error;
      
      notify.success('Note added successfully');
      setIsAddingNote(false);
    } catch (error) {
      console.error('Error adding note:', error);
      notify.error('Failed to add note');
    } finally {
      stopLoading('add');
    }
  };

  // Update note
  const handleEdit = async (formData: Partial<TalentNote>) => {
    if (!editingNote) return;

    try {
      startLoading('edit');
      const { error } = await supabase
        .from('talent_notes')
        .update(formData)
        .eq('id', editingNote.id);

      if (error) throw error;
      
      notify.success('Note updated successfully');
      setEditingNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
      notify.error('Failed to update note');
    } finally {
      stopLoading('edit');
    }
  };

  // Delete note
  const handleDelete = async (noteId: string) => {
    try {
      startLoading('delete');
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
      stopLoading('delete');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Talent Notes</h2>
        <Button 
          onClick={() => setIsAddingNote(true)}
          disabled={isLoading('add')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>

      {isAddingNote && (
        <TalentNoteForm
          onSubmit={handleAdd}
          onCancel={() => setIsAddingNote(false)}
          isLoading={isLoading('add')}
        />
      )}

      {editingNote && (
        <TalentNoteForm
          note={editingNote}
          onSubmit={handleEdit}
          onCancel={() => setEditingNote(null)}
          isLoading={isLoading('edit')}
        />
      )}

      <TalentNoteTable
        shotListId={shotListId!}
        onEdit={setEditingNote}
        onDelete={handleDelete}
        isDeleting={isLoading('delete')}
      />
    </div>
  );
}