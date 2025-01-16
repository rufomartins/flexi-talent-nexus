import { Card } from "@/components/ui/card";
import { ViewSettingsSection } from "./sections/ViewSettingsSection";
import { FilterSection } from "./sections/FilterSection";
import { TalentListingSection } from "./sections/TalentListingSection";
import type { TalentProfile } from "@/types/talent";
import type { FilterState, GuestViewSettings } from "@/types/guest-filters";
import type { GuestSelection } from "@/types/supabase/guest-selection";

interface GuestContentProps {
  talents: TalentProfile[];
  selections: Record<string, GuestSelection>;
  viewSettings: GuestViewSettings;
  filters: FilterState;
  isLoading: boolean;
  castingId: string;
  guestId: string;
  onSelectionUpdate: (talentId: string, update: Partial<GuestSelection>) => Promise<void>;
  onMultipleUpdate: (updates: Record<string, Partial<GuestSelection>>) => Promise<void>;
  onReorder: (newOrder: Record<string, number>) => Promise<void>;
  onRemove: (talentId: string) => Promise<void>;
  onViewChange: (settings: GuestViewSettings) => void;
  onFilterChange: (filters: FilterState) => void;
}

export const GuestContent: React.FC<GuestContentProps> = ({
  talents,
  selections,
  viewSettings,
  filters,
  isLoading,
  castingId,
  guestId,
  onSelectionUpdate,
  onMultipleUpdate,
  onReorder,
  onRemove,
  onViewChange,
  onFilterChange,
}) => {
  return (
    <Card className="p-4 space-y-6">
      <ViewSettingsSection
        viewSettings={viewSettings}
        onViewChange={onViewChange}
      />
      
      <FilterSection
        filters={filters}
        onFilterChange={onFilterChange}
      />
      
      <TalentListingSection
        talents={talents}
        selections={selections}
        viewMode={viewSettings.view_mode}
        isLoading={isLoading}
        sort={{
          field: viewSettings.sort_by,
          direction: viewSettings.sort_direction
        }}
        filters={filters}
        castingId={castingId}
        guestId={guestId}
        onSelect={onSelectionUpdate}
        onMultipleSelect={onMultipleUpdate}
        onReorder={onReorder}
        onRemove={onRemove}
      />
    </Card>
  );
};