import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ActivityQueryParams {
  activityType: string;
  dateRange: Date;
  sortField: 'created_at' | 'action_type';
  sortOrder: 'desc' | 'asc';
}

interface ActivityResponse {
  activities: Array<{
    id: string;
    action_type: string;
    details: Record<string, any>;
    created_at: string;
    user_id: string;
  }>;
  nextPage: number;
  totalCount: number;
}

export function useActivityQuery(params: ActivityQueryParams) {
  return useInfiniteQuery({
    queryKey: ['activities', params],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error, count } = await supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact' })
        .order(params.sortField, { ascending: params.sortOrder === 'asc' })
        .range(pageParam * 10, (pageParam + 1) * 10 - 1);

      if (error) throw error;

      return {
        activities: data.map(item => ({
          id: item.id,
          action_type: item.action_type,
          details: item.details || {},
          created_at: item.created_at,
          user_id: item.user_id
        })),
        nextPage: pageParam + 1,
        totalCount: count || 0
      } as ActivityResponse;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage
  });
}