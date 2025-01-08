import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { EquipmentFormData } from "@/types/equipment";

interface EquipmentDetailsSectionProps {
  register: UseFormRegister<EquipmentFormData>;
  errors: FieldErrors<EquipmentFormData>;
}

export function EquipmentDetailsSection({ 
  register, 
  errors 
}: EquipmentDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="equipment_type">Equipment Type *</Label>
        <Input
          id="equipment_type"
          {...register("equipment_type", { required: "Equipment type is required" })}
        />
        {errors.equipment_type && (
          <p className="text-sm text-red-500">{errors.equipment_type.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="specifications">Specifications</Label>
        <Input
          id="specifications"
          {...register("specifications")}
        />
      </div>
    </div>
  );
}