import { FilterControls } from "./FilterControls";
import { TalentDisplay } from "./talent-display/TalentDisplay";
import type { TalentProfile } from "@/types/talent";
import type { GuestFilters, GuestViewSettings } from "@/types/guest-filters";
import type { GuestSelection } from "@/types/supabase/guest-selection";

interface GuestContentProps {
  talents: TalentProfile[];
  selections: Record<string, GuestSelection>;
  viewSettings: GuestViewSettings;
  filters: GuestFilters;
  isLoading: boolean;
  onFilterChange: (filters: GuestFilters) => void;
  onViewChange: (settings: GuestViewSettings) => void;
  onSelectionUpdate: (talentId: string, update: Partial<GuestSelection>) => Promise<void>;
}

export const GuestContent: React.FC<GuestContentProps> = ({
  talents,
  selections,
  viewSettings,
  filters,
  isLoading,
  onFilterChange,
  onViewChange,
  onSelectionUpdate,
}) => {
  return (
    <div>
      <FilterControls
        filters={filters}
        onFilterChange={onFilterChange}
        viewSettings={viewSettings}
        onViewChange={onViewChange}
      />

      <div className="mt-6">
        <TalentDisplay
          talents={talents}
          viewMode={viewSettings.view_mode}
          selections={selections}
          onSelect={onSelectionUpdate}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};