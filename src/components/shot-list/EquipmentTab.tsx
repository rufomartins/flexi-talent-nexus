import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEquipment } from '@/hooks/useEquipment';
import { EquipmentHeader } from './equipment/EquipmentHeader';
import { EquipmentTable } from './equipment/EquipmentTable';
import { EquipmentForm } from './equipment/EquipmentForm';
import type { Equipment, EquipmentFormData } from '@/types/equipment';

interface EquipmentTabProps {
  shotListId: string;
}

export function EquipmentTab({ shotListId }: EquipmentTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const {
    equipment,
    isLoading,
    loadingStates,
    addEquipment,
    updateEquipment,
    deleteEquipment
  } = useEquipment(shotListId);

  const handleSubmit = async (formData: EquipmentFormData) => {
    const success = editingEquipment
      ? await updateEquipment(editingEquipment.id, formData)
      : await addEquipment(formData);

    if (success) {
      setIsDialogOpen(false);
      setEditingEquipment(null);
    }
  };

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteEquipment(id);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingEquipment(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <EquipmentHeader onAddClick={() => setIsDialogOpen(true)} />
      
      <EquipmentTable
        equipment={equipment || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={loadingStates.delete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEquipment ? 'Edit' : 'Add'} Equipment
            </DialogTitle>
          </DialogHeader>
          <EquipmentForm
            equipment={editingEquipment || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={loadingStates.add || loadingStates.edit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}