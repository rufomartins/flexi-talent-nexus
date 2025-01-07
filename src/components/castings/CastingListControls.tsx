import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SortOption } from './types';

interface CastingListControlsProps {
  onSearch: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onShowClosedChange: (checked: boolean) => void;
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
  onNewCasting
}: CastingListControlsProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="project_manager">Project Manager</SelectItem>
            <SelectItem value="creation_date">Creation date</SelectItem>
            <SelectItem value="client_remarks">Client remarks</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="showClosed" 
            checked={showClosed}
            onCheckedChange={onShowClosedChange}
          />
          <label htmlFor="showClosed" className="text-sm text-gray-600">
            Show closed
          </label>
        </div>
        
        <Button onClick={onNewCasting}>
          + New casting
        </Button>
      </div>
    </div>
  );
}