import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TalentNotesHeaderProps {
  onAddClick: () => void;
}

export function TalentNotesHeader({ onAddClick }: TalentNotesHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold">Talent Notes</h2>
      <Button onClick={onAddClick}>
        <Plus className="w-4 h-4 mr-2" />
        Add Note
      </Button>
    </div>
  );
}