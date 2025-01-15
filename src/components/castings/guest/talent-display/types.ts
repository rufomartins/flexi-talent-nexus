import { TalentProfile } from "@/types/talent";
import type { GuestSelection } from "@/types/supabase/guest-selection";
import type { SortField, SortDirection, FilterState } from "@/types/guest-filters";

export interface TalentDisplayProps {
  talents: TalentProfile[];
  viewMode: 'grid' | 'list';
  sort: {
    field: SortField;
    direction: SortDirection;
  };
  filters: FilterState;
  castingId: string;
  guestId: string;
  selections?: Record<string, GuestSelection>;
  onSelect?: (talentId: string, update: Partial<GuestSelection>) => Promise<void>;
  isLoading?: boolean;
  savingStatus?: Record<string, boolean>;
  errorMessages?: Record<string, string>;
}

export interface TalentGridProps extends TalentDisplayProps {
  columnCount?: number;
}

export interface TalentListProps extends TalentDisplayProps {
  showDetailedInfo?: boolean;
}