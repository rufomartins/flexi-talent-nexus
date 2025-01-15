import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FilterState } from "@/types/guest-filters";

interface SearchFilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function SearchFilterBar({
  filters,
  onFilterChange,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex-grow max-w-md relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={filters.search_term}
          onChange={(e) => onFilterChange({
            ...filters,
            search_term: e.target.value
          })}
          placeholder="Search talents..."
          className="pl-9 w-full"
        />
      </div>

      <Select
        value={filters.show_only_available ? 'available' : 'all'}
        onValueChange={(value) => 
          onFilterChange({
            ...filters,
            show_only_available: value === 'available'
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Talents</SelectItem>
          <SelectItem value="available">Available Only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}