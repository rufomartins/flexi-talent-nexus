import type { FilterState, SortField, SortDirection, TalentDisplayProps } from "@/types/guest-filters";

export type { FilterState, SortField, SortDirection, TalentDisplayProps };

export interface TalentGridProps extends TalentDisplayProps {
  viewMode: 'grid';
}

export interface TalentListProps extends TalentDisplayProps {
  viewMode: 'list';
}