import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityQueryOptions {
  activityType: string | null;
  dateRange?: Date;
  sortField?: 'created_at' | 'action_type';
  sortOrder?: 'desc' | 'asc';
  itemsPerPage?: number;
}

export function useActivityQuery(options: ActivityQueryOptions = {}) {
  const { activityType, dateRange, sortField = 'created_at', sortOrder = 'desc', itemsPerPage = 10 } = options;

  return useInfiniteQuery({
    queryKey: ['activities', { activityType, dateRange, sortField, sortOrder }],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact' });

      if (activityType) {
        query = query.eq('action_type', activityType);
      }

      if (dateRange) {
        query = query.gte('created_at', dateRange.toISOString());
      }

      query = query
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range(pageParam * itemsPerPage, (pageParam + 1) * itemsPerPage - 1);

      const { data: activities, error, count } = await query;

      if (error) throw error;

      return {
        activities: activities || [],
        totalCount: count || 0,
        nextPage: activities?.length === itemsPerPage ? pageParam + 1 : undefined
      };
    },
    getNextPageParam: (lastPage, pages) => lastPage.nextPage,
    initialPageSize: itemsPerPage
  });
}