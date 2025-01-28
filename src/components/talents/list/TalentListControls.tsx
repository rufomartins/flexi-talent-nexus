import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionsDropdown } from "@/components/talents/ActionsDropdown";

interface TalentListControlsProps {
  selectedIds: Set<string>;
  onSelectAll: () => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onAction: (action: string) => Promise<void>;
}

export const TalentListControls: React.FC<TalentListControlsProps> = ({
  selectedIds,
  onSelectAll,
  sortBy,
  onSortChange,
  onAction
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <Checkbox 
          checked={selectedIds.size > 0}
          onCheckedChange={onSelectAll}
        />
        <span className="text-sm text-muted-foreground">
          {selectedIds.size} selected
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="created_at">Newest</SelectItem>
            <SelectItem value="updated_at">Last Update</SelectItem>
            <SelectItem value="native_language">Language</SelectItem>
          </SelectContent>
        </Select>
        {selectedIds.size > 0 && (
          <ActionsDropdown 
            selectedItems={Array.from(selectedIds)} 
            onAction={onAction}
          />
        )}
      </div>
    </div>
  );
};