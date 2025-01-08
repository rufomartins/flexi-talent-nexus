import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShotSelectionGroup } from "./ShotSelectionGroup";
import { supabase } from "@/integrations/supabase/client";
import type { Equipment, EquipmentFormData } from "@/types/equipment";
import type { Shot } from "@/types/shot-list";

interface EquipmentFormProps {
  equipment?: Equipment;
  onSubmit: (data: EquipmentFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  shotListId: string;
}

export function EquipmentForm({ 
  equipment, 
  onSubmit, 
  onCancel, 
  isSubmitting,
  shotListId
}: EquipmentFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EquipmentFormData>({
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

  const { data: shots = [] } = useQuery({
    queryKey: ['shots', shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shots')
        .select('*')
        .eq('shot_list_id', shotListId)
        .order('sequence_order', { ascending: true });

      if (error) throw error;
      return data as Shot[];
    }
  });

  const selectedShots = watch('required_shots') || [];

  const handleShotSelectionChange = (shotIds: string[]) => {
    setValue('required_shots', shotIds);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        <Label>Required Shots</Label>
        <ShotSelectionGroup
          shots={shots}
          selectedShots={selectedShots}
          onSelectionChange={handleShotSelectionChange}
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