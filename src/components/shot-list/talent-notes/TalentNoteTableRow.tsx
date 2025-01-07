import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { TalentNote } from "@/types/shot-list";

interface TalentNoteTableRowProps {
  note: TalentNote;
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function TalentNoteTableRow({ note, onEdit, onDelete, isDeleting }: TalentNoteTableRowProps) {
  return (
    <TableRow>
      <TableCell>{note.shot_reference}</TableCell>
      <TableCell>{note.instructions}</TableCell>
      <TableCell>{note.required_props}</TableCell>
      <TableCell>{note.additional_notes}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(note.id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}