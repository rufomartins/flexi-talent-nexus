import { UserX } from "lucide-react";
import { TalentDisplay } from "../talent-display/TalentDisplay";
import { TalentGridSkeleton } from "@/components/loading/LoadingStates";
import type { TalentProfile } from "@/types/talent";
import type { GuestSelection } from "@/types/supabase/guest-selection";

interface TalentListingSectionProps {
  talents: TalentProfile[];
  selections: Record<string, GuestSelection>;
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  filters: any;
  castingId: string;
  guestId: string;
  onSelect: (talentId: string, selection: Partial<GuestSelection>) => Promise<void>;
  onMultipleSelect?: (selections: Record<string, Partial<GuestSelection>>) => Promise<void>;
  onReorder?: (newOrder: Record<string, number>) => Promise<void>;
  onRemove?: (talentId: string) => Promise<void>;
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
  onRemove
}) => {
  if (isLoading) {
    return <TalentGridSkeleton />;
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
    />
  );
};