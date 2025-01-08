import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { UseFormRegister } from "react-hook-form";
import type { EquipmentFormData } from "@/types/equipment";

interface NotesSectionProps {
  register: UseFormRegister<EquipmentFormData>;
}

export function NotesSection({ register }: NotesSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        {...register("notes")}
      />
    </div>
  );
}