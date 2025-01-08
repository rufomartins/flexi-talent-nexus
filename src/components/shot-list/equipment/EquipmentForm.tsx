import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Equipment, EquipmentFormData } from "@/types/equipment";

interface EquipmentFormProps {
  equipment?: Equipment;
  onSubmit: (data: EquipmentFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function EquipmentForm({ 
  equipment, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}: EquipmentFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EquipmentFormData>({
    defaultValues: equipment ? {
      equipment_type: equipment.equipment_type,
      specifications: equipment.specifications || '',
      required_shots: equipment.required_shots || [],
      notes: equipment.notes || ''
    } : {
      equipment_type: '',
      specifications: '',
      required_shots: [],
      notes: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <div className="space-y-2">
        <Label htmlFor="required_shots">Required Shots</Label>
        <Input
          id="required_shots"
          {...register("required_shots")}
          placeholder="Enter shot numbers separated by commas"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : equipment ? 'Update' : 'Add'} Equipment
        </Button>
      </div>
    </form>
  );
}