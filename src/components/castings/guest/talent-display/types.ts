import { TalentProfile } from "@/types/talent";

export interface TalentSelection {
  liked: boolean;
  comments?: string;
  preference_order?: number;
}

export interface TalentDisplayProps {
  talents: TalentProfile[];
  viewMode: 'grid' | 'list';
  selections: Record<string, TalentSelection>;
  onSelect: (talentId: string, selection: Partial<TalentSelection>) => void;
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
  selection?: TalentSelection;
  view: 'grid' | 'list';
  onLike: (liked: boolean) => void;
  onComment: (comment: string) => void;
  onPreferenceOrder: (order: number) => void;
}