import type { TalentProfile } from "./talent";
import type { GuestSelection } from "./supabase/guest-selection";

export type SortField = 'name' | 'favorite' | 'date_added';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search_term: string;
  show_only_available: boolean;
  filter_out_rejected: boolean;
  show_only_approved_auditions: boolean;
  round_filter?: number;
}

export interface GuestFilters extends FilterState {
  // Additional guest-specific filter properties can be added here
}

export interface GuestViewSettings {
  view_mode: 'grid' | 'list';
  sort_by: SortField;
  sort_direction: SortDirection;
}

export interface GuestContentProps {
  talents: TalentProfile[];
  selections: Record<string, GuestSelection>;
  viewSettings: GuestViewSettings;
  filters: FilterState;
  isLoading: boolean;
  onSelect: (talentId: string, update: Partial<GuestSelection>) => Promise<void>;
  onViewChange: (settings: GuestViewSettings) => void;
  onFilterChange: (filters: FilterState) => void;
  castingId: string;
}

export interface TalentDisplayProps {
  talents: TalentProfile[];
  viewMode: 'grid' | 'list';
  selections: Record<string, GuestSelection>;
  onSelect: (talentId: string, update: Partial<GuestSelection>) => Promise<void>;
  onMultipleSelect?: (updates: Record<string, Partial<GuestSelection>>) => Promise<void>;
  onReorder?: (newOrder: Record<string, number>) => Promise<void>;
  onRemove?: (talentId: string) => Promise<void>;
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
  selectedTalents: Set<string>;
  onTalentSelect: (talentId: string, selected: boolean) => void;
}

export interface TalentGridProps extends TalentDisplayProps {
  viewMode: 'grid';
}

export interface TalentListProps extends TalentDisplayProps {
  viewMode: 'list';
}

export interface ShareLink {
  id: string;
  casting_id: string;
  guest_id: string;
  token: string;
  expires_at: string;
  allow_comments: boolean;
  readonly: boolean;
  created_at: string;
  created_by: string;
  casting: {
    name: string;
  };
  guest: {
    full_name: string;
  };
}