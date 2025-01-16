import { UserX } from 'lucide-react';
import { FilterControls } from "./FilterControls";
import { TalentDisplay } from "./talent-display/TalentDisplay";
import { StatusBarSkeleton, TalentGridSkeleton } from "@/components/loading/LoadingStates";
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
  onFilterChange: (filters: FilterState) => void;
  onViewChange: (settings: GuestViewSettings) => void;
  onSelectionUpdate: (talentId: string, update: Partial<GuestSelection>) => Promise<void>;
}

export const GuestContent: React.FC<GuestContentProps> = ({
  talents,
  selections,
  viewSettings,
  filters,
  isLoading,
  castingId,
  guestId,
  onFilterChange,
  onViewChange,
  onSelectionUpdate,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <StatusBarSkeleton />
        <TalentGridSkeleton />
      </div>
    );
  }

  if (!talents.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <UserX className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">No talents found</h3>
        <p className="text-gray-600">Try adjusting your filters</p>
      </div>
    );
  }

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
          sort={{
            field: viewSettings.sort_by,
            direction: viewSettings.sort_direction
          }}
          filters={filters}
          castingId={castingId}
          guestId={guestId}
        />
      </div>
    </div>
  );
};