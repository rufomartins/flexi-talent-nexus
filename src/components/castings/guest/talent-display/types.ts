import type { TalentProfile } from "@/types/talent";
import type { GuestSelection } from "@/types/supabase/guest-selection";
import type { GuestFilters, SortField, SortDirection, TalentDisplayProps } from "@/types/guest-filters";

export type { GuestFilters, SortField, SortDirection, TalentDisplayProps };

export interface TalentGridProps extends TalentDisplayProps {
  viewMode: 'grid';
}

export interface TalentListProps extends TalentDisplayProps {
  viewMode: 'list';
}