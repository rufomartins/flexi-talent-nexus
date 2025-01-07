import { useQuery } from "@tanstack/react-query";
import { Table, TableBody } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";
import { TalentNoteTableHeader } from "./TalentNoteTableHeader";
import { TalentNoteTableRow } from "./TalentNoteTableRow";
import type { TalentNote } from "@/types/shot-list";

interface TalentNoteTableProps {
  shotListId: string;
  onEdit: (note: TalentNote) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function TalentNoteTable({ shotListId, onEdit, onDelete, isDeleting }: TalentNoteTableProps) {
  const { data: notes, isLoading } = useQuery({
    queryKey: ["talent-notes", shotListId],
    queryFn: async () => {
      const { data: notes, error } = await supabase
        .from("talent_notes")
        .select("*")
        .eq("shot_list_id", shotListId)
        .order("created_at", { ascending: false });

      if (error) {
        notify.error("Failed to load talent notes");
        throw error;
      }

      return notes as TalentNote[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TalentNoteTableHeader />
        <TableBody>
          {notes?.map((note) => (
            <TalentNoteTableRow
              key={note.id}
              note={note}
              onEdit={() => onEdit(note)}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
          {!notes?.length && (
            <tr>
              <td colSpan={5} className="text-center text-muted-foreground p-4">
                No notes added yet
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
}