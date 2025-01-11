import { TalentProfile } from "./talent";

export interface TalentSearchFilters {
  categories: ('UGC' | 'Translator' | 'Reviewer' | 'VO')[];
  languages?: string[];
  countries?: string[];
  availability?: {
    start?: string;
    end?: string;
  };
  status?: 'pending' | 'approved' | 'rejected';
  experience_level?: string[];
}

export interface TalentSearchSort {
  field: 'name' | 'country' | 'native_language' | 'created_at' | 'status';
  direction: 'asc' | 'desc';
}