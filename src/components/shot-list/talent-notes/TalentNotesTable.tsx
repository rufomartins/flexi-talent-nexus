import { Table, TableBody } from "@/components/ui/table";
import { TalentNoteTableHeader } from "./TalentNoteTableHeader";
import { TalentNotesTableRow } from "./TalentNotesTableRow";
import type { TalentNote } from "@/types/shot-list";

interface TalentNotesTableProps {
  notes: TalentNote[];
  onEdit: (note: TalentNote) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function TalentNotesTable({ 
  notes, 
  onEdit, 
  onDelete, 
  isDeleting 
}: TalentNotesTableProps) {
  if (!notes?.length) {
    return (
      <div className="text-center text-muted-foreground p-4 border rounded-md">
        No notes added yet
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TalentNoteTableHeader />
        <TableBody>
          {notes.map((note) => (
            <TalentNotesTableRow
              key={note.id}
              note={note}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}