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
