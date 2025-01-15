import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ViewControlsProps {
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: { field: string; direction: 'asc' | 'desc' };
  onSortChange: (option: { field: string; direction: 'asc' | 'desc' }) => void;
}

export function ViewControls({
  viewMode,
  onViewChange,
  searchQuery,
  onSearchChange,
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

      <div className="flex-grow max-w-md">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search talents..."
          className="w-full"
        />
      </div>

      <Select
        value={`${sortOption.field}-${sortOption.direction}`}
        onValueChange={(value) => {
          const [field, direction] = value.split('-') as [string, 'asc' | 'desc'];
          onSortChange({ field, direction });
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          <SelectItem value="preferenceOrder-asc">Preference (Low to High)</SelectItem>
          <SelectItem value="preferenceOrder-desc">Preference (High to Low)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}