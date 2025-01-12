import { Grid, List, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchBar } from "./SearchBar";
import { StatusToggle } from "./StatusToggle";
import { GuestFilters, GuestViewSettings } from "@/types/guest-filters";
import { Card } from "@/components/ui/card";

interface FilterControlsProps {
  filters: GuestFilters;
  onFilterChange: (filters: GuestFilters) => void;
  viewSettings: GuestViewSettings;
  onViewChange: (settings: GuestViewSettings) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFilterChange,
  viewSettings,
  onViewChange,
}) => {
  const updateFilter = (key: keyof GuestFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleSortDirection = () => {
    onViewChange({
      ...viewSettings,
      sort_direction: viewSettings.sort_direction === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={filters.search_term || ''}
            onChange={(value) => updateFilter('search_term', value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onViewChange({ ...viewSettings, view_mode: 'grid' })}
            className={viewSettings.view_mode === 'grid' ? 'bg-muted' : ''}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onViewChange({ ...viewSettings, view_mode: 'list' })}
            className={viewSettings.view_mode === 'list' ? 'bg-muted' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortDirection}
          >
            {viewSettings.sort_direction === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
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

        <div className="flex gap-2 ml-auto">
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

          <Select
            value={viewSettings.sort_by}
            onValueChange={(value) => onViewChange({ ...viewSettings, sort_by: value as GuestViewSettings['sort_by'] })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="favorite">Favorites</SelectItem>
              <SelectItem value="date_added">Date Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};