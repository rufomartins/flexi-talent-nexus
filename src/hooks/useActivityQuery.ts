import { useQuery } from '@tanstack/react-query';
import type { QueryConfig } from '@/types/shared';

interface ActivityQueryOptions extends QueryConfig {
  type?: string;
  limit?: number;
}

export function useActivityQuery(options: ActivityQueryOptions = {}) {
  const { type, limit = 10, ...queryConfig } = options;

  return useQuery({
    queryKey: ['activities', { type, limit }],
    queryFn: async () => {
      const response = await fetch(`/api/activities?type=${type}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      return response.json();
    },
    ...queryConfig
  });
}
