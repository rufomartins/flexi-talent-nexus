import { TalentProfile } from "@/types/talent";
import type { GuestSelection } from "@/types/supabase/guest-selection";
import type { SortField, SortDirection, FilterState } from "@/types/guest-filters";

export interface TalentDisplayProps {
  talents: TalentProfile[];
  viewMode: 'grid' | 'list';
  selections: Record<string, GuestSelection>;
  onSelect: (talentId: string, update: Partial<GuestSelection>) => Promise<void>;
  isLoading: boolean;
  sort: {
    field: SortField;
    direction: SortDirection;
  };
  filters: FilterState;
  castingId: string;
  guestId: string;
}

export interface TalentGridProps extends TalentDisplayProps {
  columnCount?: number;
}

export interface TalentListProps extends TalentDisplayProps {
  showDetailedInfo?: boolean;
}