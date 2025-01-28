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

export type SortField = 'created_at' | 'action_type';
export type SortOrder = 'asc' | 'desc';

export interface ActivityQueryOptions {
  activityType: string | null;
  dateRange?: Date;
  sortField?: SortField;
  sortOrder?: SortOrder;
  itemsPerPage?: number;
}

export interface ActivityQueryResponse {
  activities: ActivityData['activities'];
  totalCount: number;
  nextPage?: number;
}