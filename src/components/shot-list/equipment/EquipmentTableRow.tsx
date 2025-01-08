import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Equipment } from "@/types/equipment";

interface EquipmentTableRowProps {
  equipment: Equipment;
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function EquipmentTableRow({ 
  equipment, 
  onEdit, 
  onDelete, 
  isDeleting 
}: EquipmentTableRowProps) {
  return (
    <TableRow>
      <TableCell>{equipment.equipment_type}</TableCell>
      <TableCell>{equipment.specifications}</TableCell>
      <TableCell>{equipment.required_shots?.join(', ')}</TableCell>
      <TableCell>{equipment.notes}</TableCell>
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
            onClick={() => onDelete(equipment.id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}