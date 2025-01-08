import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTalentNotes } from '@/hooks/useTalentNotes';
import { TalentNoteForm } from './talent-notes/TalentNoteForm';
import { TalentNotesHeader } from './talent-notes/TalentNotesHeader';
import { TalentNotesTable } from './talent-notes/TalentNotesTable';
import type { TalentNote } from '@/types/shot-list';

export function TalentNotesTab() {
  const { shotListId } = useParams<{ shotListId: string }>();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<TalentNote | null>(null);
  
  const { 
    notes, 
    isLoading, 
    loadingStates, 
    addNote, 
    updateNote, 
    deleteNote 
  } = useTalentNotes(shotListId!);

  const handleAdd = async (formData: Partial<TalentNote>) => {
    const success = await addNote(formData);
    if (success) setIsAddingNote(false);
  };

  const handleEdit = async (formData: Partial<TalentNote>) => {
    if (!editingNote) return;
    const success = await updateNote(editingNote.id, formData);
    if (success) setEditingNote(null);
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TalentNotesHeader onAddClick={() => setIsAddingNote(true)} />

      {isAddingNote && (
        <TalentNoteForm
          onSubmit={handleAdd}
          onCancel={() => setIsAddingNote(false)}
          isLoading={loadingStates.add}
        />
      )}

      {editingNote && (
        <TalentNoteForm
          note={editingNote}
          onSubmit={handleEdit}
          onCancel={() => setEditingNote(null)}
          isLoading={loadingStates.edit}
        />
      )}

      <TalentNotesTable
        notes={notes || []}
        onEdit={setEditingNote}
        onDelete={handleDelete}
        isDeleting={loadingStates.delete}
      />
    </div>
  );
}