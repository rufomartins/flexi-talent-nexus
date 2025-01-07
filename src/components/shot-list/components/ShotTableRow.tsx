import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { Shot } from "@/types/shot-list";

interface ShotTableRowProps {
  shot: Shot;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function ShotTableRow({ shot, onEdit, onDelete, isDeleting }: ShotTableRowProps) {
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
  };

  const handleDelete = async () => {
    try {
      await onDelete(shot.id);
    } catch (error) {
      console.error("Error deleting shot:", error);
    }
  };

  return (
    <TableRow key={shot.id} className="group">
      <TableCell className="w-4">
        <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 cursor-move" />
      </TableCell>
      <TableCell>{shot.shot_number}</TableCell>
      <TableCell>{shot.location?.name || "—"}</TableCell>
      <TableCell>{shot.description || "—"}</TableCell>
      <TableCell>{shot.frame_type || "—"}</TableCell>
      <TableCell>
        <Badge className={statusColors[shot.status as keyof typeof statusColors]}>
          {shot.status}
        </Badge>
      </TableCell>
      <TableCell>{shot.notes || "—"}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(shot.id)}
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