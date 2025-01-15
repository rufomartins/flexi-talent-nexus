export type SortField = 'name' | 'favorite' | 'date_added' | 'preferenceOrder';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  preferenceStatus: 'all' | 'selected' | 'unselected';
  show_only_available?: boolean;
  filter_out_rejected?: boolean;
  show_only_approved_auditions?: boolean;
  round_filter?: number;
}

export interface GuestViewSettings {
  view_mode: 'grid' | 'list';
  sort_by: SortField;
  sort_direction: SortDirection;
}