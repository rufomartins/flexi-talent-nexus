import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

interface TalentListHeaderProps {
  onSearchOpen: () => void;
  onAddTalentOpen: () => void;
  isSuperAdmin: boolean;
}

export const TalentListHeader: React.FC<TalentListHeaderProps> = ({
  onSearchOpen,
  onAddTalentOpen,
  isSuperAdmin
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">Talents</h1>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onSearchOpen}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        {isSuperAdmin && (
          <Button onClick={onAddTalentOpen}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Talent
          </Button>
        )}
      </div>
    </div>
  );
};