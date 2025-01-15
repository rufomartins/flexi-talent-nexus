import type { TalentProfile } from "./talent";
import type { GuestSelection } from "./supabase/guest-selection";
import { Dispatch, SetStateAction } from "react";

export type SortField = 'name' | 'favorite' | 'date_added';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search_term: string;
  show_only_available: boolean;
  filter_out_rejected: boolean;
  show_only_approved_auditions: boolean;
  round_filter?: number;
}

export interface GuestViewSettings {
  view_mode: 'grid' | 'list';
  sort_by: SortField;
  sort_direction: SortDirection;
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
  savingStatus?: { [key: string]: boolean };
  errorMessages?: { [key: string]: string };
}

export interface TalentGridProps extends TalentDisplayProps {
  viewMode: 'grid';
}

export interface TalentListProps extends TalentDisplayProps {
  viewMode: 'list';
}

export interface GuestFilters extends FilterState {
  // Additional guest-specific filter properties can be added here
}