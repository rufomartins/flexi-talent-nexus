import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EquipmentTableRow } from "./EquipmentTableRow";
import type { Equipment } from "@/types/equipment";

interface EquipmentTableProps {
  equipment: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function EquipmentTable({ 
  equipment, 
  onEdit, 
  onDelete, 
  isDeleting 
}: EquipmentTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Specifications</TableHead>
            <TableHead>Required Shots</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipment.map((item) => (
            <EquipmentTableRow
              key={item.id}
              equipment={item}
              onEdit={() => onEdit(item)}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          ))}
          {!equipment.length && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground p-4">
                No equipment added yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}