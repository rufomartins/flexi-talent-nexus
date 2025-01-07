import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import type { TalentNote } from "@/types/shot-list";

interface TalentNoteTableRowProps {
  note: TalentNote;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function TalentNoteTableRow({ note, onEdit, onDelete, isDeleting }: TalentNoteTableRowProps) {
  const handleDelete = async () => {
    try {
      await onDelete(note.id);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <TableRow>
      <TableCell>{note.shot_reference || '—'}</TableCell>
      <TableCell>{note.instructions || '—'}</TableCell>
      <TableCell>{note.required_props || '—'}</TableCell>
      <TableCell>{note.additional_notes || '—'}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(note.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}