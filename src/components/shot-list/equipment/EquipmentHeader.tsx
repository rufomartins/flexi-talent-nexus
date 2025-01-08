import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EquipmentHeaderProps {
  onAddClick: () => void;
}

export function EquipmentHeader({ onAddClick }: EquipmentHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">Equipment</h2>
      <Button onClick={onAddClick}>
        <Plus className="w-4 h-4 mr-2" />
        Add Equipment
      </Button>
    </div>
  );
}