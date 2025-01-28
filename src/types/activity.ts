export interface ProjectActivity {
  id: string;
  project_id: string;
  action_type: string;
  details: Record<string, any>;
  created_at: string;
  user_id: string;
}

export interface ActivityData {
  activities: ProjectActivity[];
  totalCount: number;
  nextPage?: number;
}

export type SortField = 'created_at' | 'action_type';
export type SortOrder = 'asc' | 'desc';