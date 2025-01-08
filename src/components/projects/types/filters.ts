import type { Database } from "@/integrations/supabase/types";

type ProjectTranslationStatus = Database["public"]["Enums"]["project_translation_status"];
type ProjectReviewStatus = Database["public"]["Enums"]["project_review_status"];
type ProjectTalentStatus = Database["public"]["Enums"]["project_talent_status"];

export interface FilterState {
  language: string | null;
  translationStatus: ProjectTranslationStatus | null;
  reviewStatus: ProjectReviewStatus | null;
  talentStatus: ProjectTalentStatus | null;
  dateRange: { start: Date | null; end: Date | null };
}

export interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export const defaultFilterState: FilterState = {
  language: null,
  translationStatus: null,
  reviewStatus: null,
  talentStatus: null,
  dateRange: { start: null, end: null }
};

export const defaultSortConfig: SortConfig = {
  column: 'created_at',
  direction: 'desc'
};