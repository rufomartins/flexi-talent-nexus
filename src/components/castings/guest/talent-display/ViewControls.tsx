import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SortField, SortDirection } from "@/types/guest-filters";

interface ViewControlsProps {
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
  sortOption: { field: SortField; direction: SortDirection };
  onSortChange: (option: { field: SortField; direction: SortDirection }) => void;
}

export function ViewControls({
  viewMode,
  onViewChange,
  sortOption,
  onSortChange,
}: ViewControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center space-x-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewChange('grid')}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="icon"
          onClick={() => onViewChange('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      <Select
        value={`${sortOption.field}-${sortOption.direction}`}
        onValueChange={(value) => {
          const [field, direction] = value.split('-') as [SortField, SortDirection];
          onSortChange({ field, direction });
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          <SelectItem value="favorite-asc">Favorites (Low to High)</SelectItem>
          <SelectItem value="favorite-desc">Favorites (High to Low)</SelectItem>
          <SelectItem value="date_added-asc">Date Added (Oldest)</SelectItem>
          <SelectItem value="date_added-desc">Date Added (Newest)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}