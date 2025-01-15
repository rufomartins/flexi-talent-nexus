import { TalentProfile } from "@/types/talent";
import type { GuestSelection } from "@/types/supabase/guest-selection";

export type SortField = 'name' | 'preferenceOrder';
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  preferenceStatus: 'all' | 'selected' | 'unselected';
}

export interface TalentDisplayProps {
  talents: TalentProfile[];
  viewMode: 'grid' | 'list';
  sort: {
    field: SortField;
    direction: SortDirection;
  };
  filters: FilterState;
  castingId: string;
  guestId: string;
  selections?: Record<string, GuestSelection>;
  onSelect?: (talentId: string, update: Partial<GuestSelection>) => Promise<void>;
  isLoading?: boolean;
  savingStatus?: Record<string, boolean>;
  errorMessages?: Record<string, string>;
}

export interface TalentGridProps extends TalentDisplayProps {
  columnCount?: number;
}

export interface TalentListProps extends TalentDisplayProps {
  showDetailedInfo?: boolean;
}

export interface TalentCardProps {
  talent: TalentProfile;
  selection?: GuestSelection;
  view: 'grid' | 'list';
  onPreferenceSet: (talentId: string, order: number) => Promise<void>;
  onCommentAdd: (talentId: string, comment: string) => Promise<void>;
  isSaving?: boolean;
  errorMessage?: string;
}