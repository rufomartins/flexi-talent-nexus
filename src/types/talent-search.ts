export interface TalentSearchFilters {
  categories: ('UGC' | 'TRANSLATOR' | 'REVIEWER' | 'VOICE_OVER')[];
  languages?: string[];
  countries?: string[];
  availability?: {
    start?: string;
    end?: string;
  };
  status?: 'approved' | 'under_evaluation' | 'rejected';
  experience_level?: string[];
}

export interface TalentSearchSort {
  field: 'created_at' | 'country' | 'native_language' | 'evaluation_status';
  direction: 'asc' | 'desc';
}