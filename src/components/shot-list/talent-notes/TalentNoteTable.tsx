import { useQuery } from '@tanstack/react-query';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { TalentNote } from '@/types/shot-list';

interface TalentNoteTableProps {
  shotListId: string;
  onEdit: (note: TalentNote) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function TalentNoteTable({ 
  shotListId, 
  onEdit, 
  onDelete, 
  isDeleting 
}: TalentNoteTableProps) {
  // Fetch notes with real-time updates
  const { data: notes } = useQuery({
    queryKey: ['talent-notes', shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_notes')
        .select('*')
        .eq('shot_list_id', shotListId);
      
      if (error) throw error;
      return data as TalentNote[];
    }
  });

  if (!notes?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No notes added yet. Click the Add Note button to create your first note.
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-3 text-left font-medium">Shot Reference</th>
            <th className="p-3 text-left font-medium">Instructions</th>
            <th className="p-3 text-left font-medium">Required Props</th>
            <th className="p-3 text-left font-medium">Additional Notes</th>
            <th className="p-3 text-left font-medium w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id} className="border-b last:border-0">
              <td className="p-3">{note.shot_reference}</td>
              <td className="p-3">
                <div dangerouslySetInnerHTML={{ __html: note.instructions || '' }} />
              </td>
              <td className="p-3">{note.required_props}</td>
              <td className="p-3">{note.additional_notes}</td>
              <td className="p-3">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(note)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(note.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}