
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Search } from "lucide-react";
import { SortOption } from "./types";

interface CastingListControlsProps {
  onSearch: (term: string) => void;
  onSortChange: (sort: SortOption) => void;
  onShowClosedChange: (show: boolean) => void;
  sortBy: SortOption;
  showClosed: boolean;
  onNewCasting: () => void;
}

export function CastingListControls({
  onSearch,
  onSortChange,
  onShowClosedChange,
  sortBy,
  showClosed,
  onNewCasting,
}: CastingListControlsProps) {
  return (
    <div className="flex flex-col gap-4 bg-muted/40 p-4 rounded-lg mb-6 sm:flex-row sm:items-center">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search castings..."
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="project_manager">Project Manager</SelectItem>
            <SelectItem value="creation_date">Creation Date</SelectItem>
            <SelectItem value="client_remarks">Client Remarks</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Switch
            id="show-closed"
            checked={showClosed}
            onCheckedChange={onShowClosedChange}
          />
          <label htmlFor="show-closed">Show closed</label>
        </div>

        <Button variant="default" onClick={onNewCasting} className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Casting
        </Button>
      </div>
    </div>
  );
}
