import { TalentProfile } from "@/types/talent";
import type { GuestSelection } from "@/types/supabase/guest-selection";

export interface TalentDisplayProps {
  talents: TalentProfile[];
  viewMode: 'grid' | 'list';
  selections: Record<string, GuestSelection>;
  onSelect: (talentId: string, selection: Partial<GuestSelection>) => void;
  isLoading?: boolean;
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
  onSelect: (selection: Partial<GuestSelection>) => Promise<void>;
}