import type { TalentProfile } from "@/types/talent";
import type { GuestSelection } from "@/types/supabase/guest-selection";
import type { FilterState } from "@/types/guest-filters";

export interface TalentDisplayProps {
  talents: TalentProfile[];
  viewMode: 'grid' | 'list';
  selections: Record<string, GuestSelection>;
  onSelect: (talentId: string, update: Partial<GuestSelection>) => Promise<void>;
  isLoading: boolean;
  sort: {
    field: 'name' | 'favorite' | 'date_added';
    direction: 'asc' | 'desc';
  };
  filters: FilterState;
  castingId: string;
  guestId: string;
  savingStatus?: Record<string, boolean>;
  errorMessages?: Record<string, string>;
}

export interface TalentGridProps extends TalentDisplayProps {
  viewMode: 'grid';
  columnCount?: number;
}

export interface TalentListProps extends TalentDisplayProps {
  viewMode: 'list';
  showDetailedInfo?: boolean;
}