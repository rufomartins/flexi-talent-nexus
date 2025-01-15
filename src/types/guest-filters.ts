export interface GuestFilters {
  search_term?: string;
  show_only_available?: boolean;
  filter_out_rejected?: boolean;
  show_only_approved_auditions?: boolean;
  round_filter?: number;
}

export interface GuestViewSettings {
  view_mode: 'grid' | 'list';
  sort_by: 'name' | 'favorite' | 'date_added';
  sort_direction: 'asc' | 'desc';
}