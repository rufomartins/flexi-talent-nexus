import { TalentDisplay } from "../talent-display/TalentDisplay";
import type { TalentProfile } from "@/types/talent";
import type { FilterState, GuestViewSettings } from "@/types/guest-filters";
import type { GuestSelection } from "@/types/supabase/guest-selection";
import { Dispatch, SetStateAction } from "react";

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
  onFilterChange: Dispatch<SetStateAction<FilterState>>;
  onViewChange: Dispatch<SetStateAction<GuestViewSettings>>;
  isUpdating: Record<string, boolean>;
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
  onFilterChange,
  onViewChange,
  isUpdating,
}) => {
  return (
    <div className="space-y-6">
      <TalentDisplay
        talents={talents}
        viewMode={viewSettings.view_mode}
        selections={selections}
        onSelect={onSelectionUpdate}
        onMultipleSelect={onMultipleUpdate}
        onReorder={onReorder}
        isLoading={isLoading}
        sort={{
          field: viewSettings.sort_by,
          direction: viewSettings.sort_direction
        }}
        filters={filters}
        castingId={castingId}
        guestId={guestId}
        savingStatus={isUpdating}
      />
    </div>
  );
};