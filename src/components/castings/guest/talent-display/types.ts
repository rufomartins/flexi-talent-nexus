import type { TalentProfile } from "@/types/talent";
import type { GuestSelection } from "@/types/supabase/guest-selection";

export type SortField = 'name' | 'preferenceOrder' | 'favorite' | 'date_added';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search_term: string;
  show_only_available: boolean;
  filter_out_rejected: boolean;
  show_only_approved_auditions: boolean;
  round_filter?: number;
}

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