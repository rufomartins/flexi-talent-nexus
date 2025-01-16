import type { TalentProfile } from "./talent";
import type { GuestSelection } from "./supabase/guest-selection";
import type { GuestViewSettings, FilterState } from "./guest-filters";

export interface HeaderSectionProps {
  totalSelected: number;
  onExport: () => void;
  onShare: () => void;
}

export interface FilterSectionProps {
  viewSettings: GuestViewSettings;
  filters: FilterState;
  onViewChange: (settings: GuestViewSettings) => void;
  onFilterChange: (filters: FilterState) => void;
}

export interface SelectionSectionProps {
  talents: TalentProfile[];
  selections: Record<string, GuestSelection>;
  viewMode: 'grid' | 'list';
  isLoading: boolean;
  onSelect: (talentId: string, update: Partial<GuestSelection>) => Promise<void>;
}

export interface ShareSectionProps {
  castingId: string;
}