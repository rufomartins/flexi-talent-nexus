import { TalentProfile } from "@/types/talent";
import type { GuestSelection } from "@/types/supabase/guest-selection";

export interface SelectionState {
  talentId: string;
  preferenceOrder: number;
  status: 'pending' | 'saved' | 'error';
  timestamp: Date;
}

export interface TalentDisplayProps {
  talents: TalentProfile[];
  viewMode: 'grid' | 'list';
  selections: Record<string, GuestSelection>;
  onSelect: (talentId: string, update: Partial<GuestSelection>) => Promise<void>;
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