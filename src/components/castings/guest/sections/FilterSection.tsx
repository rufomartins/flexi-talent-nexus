import { SearchBar } from "../SearchBar";
import { StatusToggle } from "../StatusToggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FilterState } from "@/types/guest-filters";

interface FilterSectionProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFilterChange
}) => {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex-1">
        <SearchBar
          value={filters.search_term || ''}
          onChange={(value) => updateFilter('search_term', value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-4">
        <StatusToggle
          filterKey="show_only_available"
          label="Available Only"
          value={filters.show_only_available}
          onChange={(value) => updateFilter('show_only_available', value)}
        />
        <StatusToggle
          filterKey="filter_out_rejected"
          label="Hide Rejected"
          value={filters.filter_out_rejected}
          onChange={(value) => updateFilter('filter_out_rejected', value)}
        />
        <StatusToggle
          filterKey="show_only_approved_auditions"
          label="Approved Auditions"
          value={filters.show_only_approved_auditions}
          onChange={(value) => updateFilter('show_only_approved_auditions', value)}
        />
      </div>

      <div className="flex gap-2">
        <Select
          value={String(filters.round_filter || '')}
          onValueChange={(value) => updateFilter('round_filter', value ? Number(value) : undefined)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select round" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Rounds</SelectItem>
            <SelectItem value="1">First Round</SelectItem>
            <SelectItem value="2">Second Round</SelectItem>
            <SelectItem value="3">Third Round</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};