import { Grid, List, SortAsc, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GuestViewSettings } from "@/types/guest-filters";

interface ViewSettingsSectionProps {
  viewSettings: GuestViewSettings;
  onViewChange: (settings: GuestViewSettings) => void;
}

export const ViewSettingsSection: React.FC<ViewSettingsSectionProps> = ({
  viewSettings,
  onViewChange
}) => {
  const toggleSortDirection = () => {
    onViewChange({
      ...viewSettings,
      sort_direction: viewSettings.sort_direction === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
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
  );
};