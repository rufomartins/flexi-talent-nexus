import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { canManageTalents } from "@/utils/permissions"
import { DatabaseUser } from "@/types/user"

interface TalentHeaderProps {
  user: Partial<DatabaseUser>;
  onAddTalent: () => void;
}

export function TalentHeader({ user, onAddTalent }: TalentHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">Talent Management</h1>
      {canManageTalents(user) && (
        <Button onClick={onAddTalent}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Talent
        </Button>
      )}
    </div>
  );
}