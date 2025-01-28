export interface ActivityData {
  activities: Array<{
    id: string;
    action_type: string;
    details: Record<string, any>;
    created_at: string;
    user_id: string;
  }>;
  totalCount: number;
}

export interface ActivityQueryOptions {
  activityType: string | null;
  dateRange?: Date;
  sortField?: 'created_at' | 'action_type';
  sortOrder?: 'desc' | 'asc';
  itemsPerPage?: number;
}

export interface ActivityQueryResponse {
  activities: ActivityData['activities'];
  totalCount: number;
  nextPage?: number;
}