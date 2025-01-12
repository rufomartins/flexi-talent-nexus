export interface ExportConfig {
  format: 'pdf' | 'excel';
  include: {
    talents: boolean;
    comments: boolean;
    preferences: boolean;
    media?: boolean;
  };
  filterBy?: {
    favorited?: boolean;
    hasComments?: boolean;
    preferenceRange?: {
      min: number;
      max: number;
    };
  };
}