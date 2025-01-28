import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ActivityQueryOptions, ActivityQueryResponse } from '@/types/activity';

export function useActivityQuery(options: ActivityQueryOptions) {
  const { activityType, dateRange, sortField = 'created_at', sortOrder = 'desc', itemsPerPage = 10 } = options;

  return useInfiniteQuery({
    queryKey: ['activities', { activityType, dateRange, sortField, sortOrder }],
    queryFn: async ({ pageParam = 0 }): Promise<ActivityQueryResponse> => {
      let query = supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact' });

      if (activityType) {
        query = query.eq('action_type', activityType);
      }

      if (dateRange) {
        query = query.gte('created_at', dateRange.toISOString());
      }

      const start = pageParam * itemsPerPage;
      const end = start + itemsPerPage - 1;

      query = query
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range(start, end);

      const { data: activities, error, count } = await query;

      if (error) throw error;

      return {
        activities: activities || [],
        totalCount: count || 0,
        nextPage: activities?.length === itemsPerPage ? pageParam + 1 : undefined
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}