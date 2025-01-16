import { Star, StarOff, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TalentDisplay } from "../talent-display/TalentDisplay";
import { TalentGridSkeleton } from "@/components/loading/LoadingStates";
import { BatchActionBar } from "../batch/BatchActionBar";
import type { TalentProfile } from "@/types/talent";
import type { GuestSelection } from "@/types/supabase/guest-selection";
import type { SortField, SortDirection } from "@/types/guest-filters";

interface BatchSelectionUpdate {
  talentIds: string[];
  update: Partial<GuestSelection>;
}

interface TalentListingSectionProps {
  talents: TalentProfile[];
  selections: Record<string, GuestSelection>;
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  sort: {
    field: SortField;
    direction: SortDirection;
  };
  filters: any;
  castingId: string;
  guestId: string;
  onSelect: (talentId: string, selection: Partial<GuestSelection>) => Promise<void>;
  onMultipleSelect?: (selections: Record<string, Partial<GuestSelection>>) => Promise<void>;
  onReorder: (newOrder: Record<string, number>) => Promise<void>;
  onRemove?: (talentId: string) => Promise<void>;
  selectedTalents: Set<string>;
  onTalentSelect: (talentId: string, selected: boolean) => void;
  onBatchUpdate: (update: BatchSelectionUpdate) => Promise<void>;
}

export const TalentListingSection: React.FC<TalentListingSectionProps> = ({
  talents,
  selections,
  viewMode,
  isLoading,
  sort,
  filters,
  castingId,
  guestId,
  onSelect,
  onMultipleSelect,
  onReorder,
  onRemove,
  selectedTalents,
  onTalentSelect,
  onBatchUpdate
}) => {
  const handleBatchAction = async (action: 'favorite' | 'unfavorite' | 'remove') => {
    if (selectedTalents.size === 0) return;

    const update: Partial<GuestSelection> = action === 'remove' 
      ? { status: 'removed' }
      : { liked: action === 'favorite' };

    await onBatchUpdate({
      talentIds: Array.from(selectedTalents),
      update
    });
  };

  if (isLoading) {
    return <TalentGridSkeleton />;
  }

  if (!talents.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">No talents found</p>
      </div>
    );
  }

  return (
    <div>
      {selectedTalents.size > 0 && (
        <BatchActionBar 
          selectedCount={selectedTalents.size}
          onFavorite={() => handleBatchAction('favorite')}
          onUnfavorite={() => handleBatchAction('unfavorite')}
          onRemove={() => handleBatchAction('remove')}
        />
      )}
      
      <TalentDisplay
        talents={talents}
        viewMode={viewMode}
        selections={selections}
        onSelect={onSelect}
        onMultipleSelect={onMultipleSelect}
        onReorder={onReorder}
        onRemove={onRemove}
        isLoading={isLoading}
        sort={sort}
        filters={filters}
        castingId={castingId}
        guestId={guestId}
        selectedTalents={selectedTalents}
        onTalentSelect={onTalentSelect}
        savingStatus={{}}
        errorMessages={{}}
      />
    </div>
  );
};