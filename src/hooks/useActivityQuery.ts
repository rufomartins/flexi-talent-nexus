import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type SortOrder = 'desc' | 'asc';
type SortField = 'created_at' | 'action_type';

export interface ActivityLog {
  id: string;
  action_type: string;
  created_at: string;
  details?: {
    status?: string;
    name?: string;
    project?: string;
    [key: string]: any;
  } | null;
  user_id?: string;
}

interface ActivityPageData {
  activities: ActivityLog[];
  totalCount: number;
  hasMore: boolean;
  nextPage: number | undefined;
}

interface UseActivityQueryParams {
  activityType: string | null;
  dateRange: Date | undefined;
  sortField: SortField;
  sortOrder: SortOrder;
  itemsPerPage: number;
}

export const useActivityQuery = ({
  activityType,
  dateRange,
  sortField,
  sortOrder,
  itemsPerPage
}: UseActivityQueryParams) => {
  const buildQuery = useCallback((pageParam: number) => {
    const from = pageParam * itemsPerPage;
    const to = from + itemsPerPage - 1;

    let query = supabase
      .from('user_activity_logs')
      .select('*', { count: 'exact' })
      .order(sortField, { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (activityType) {
      if (activityType.startsWith('new_registration_')) {
        query = query
          .eq('action_type', 'registration')
          .eq('details->status', activityType.replace('new_registration_', ''));
      } else if (activityType.startsWith('project_')) {
        query = query
          .eq('action_type', 'project')
          .eq('details->status', activityType.replace('project_', ''));
      }
    }

    if (dateRange) {
      const startOfDay = new Date(dateRange);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateRange);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());
    }

    return query;
  }, [activityType, dateRange, sortField, sortOrder, itemsPerPage]);

  return useInfiniteQuery<ActivityPageData, Error>({
    queryKey: ['recent-activities', activityType, dateRange, sortField, sortOrder],
    queryFn: async ({ pageParam = 0 }) => {
      const query = buildQuery(pageParam as number);
      const { data: activities, error, count } = await query;

      if (error) {
        console.error('Error fetching activities:', error);
        throw new Error(error.message);
      }

      return {
        activities: activities as ActivityLog[],
        totalCount: count || 0,
        hasMore: activities?.length === itemsPerPage,
        nextPage: activities?.length === itemsPerPage ? (pageParam as number) + 1 : undefined
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 30000,
    retry: 2,
  });
};