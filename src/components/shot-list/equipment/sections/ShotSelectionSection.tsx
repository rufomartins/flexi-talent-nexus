import { ShotSelectionGroup } from '../ShotSelectionGroup';
import type { Shot } from '@/types/shot-list';

interface ShotSelectionSectionProps {
  selectedShots: string[];
  onSelectionChange: (shots: string[]) => void;
  shots: Shot[];
}

export function ShotSelectionSection({ 
  selectedShots,
  onSelectionChange,
  shots
}: ShotSelectionSectionProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Required Shots</label>
      <ShotSelectionGroup
        shots={shots}
        selectedShots={selectedShots}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
}