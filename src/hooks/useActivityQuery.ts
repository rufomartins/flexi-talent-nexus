import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ActivityQueryOptions } from "@/types/activity";

export function useActivityQuery(options: ActivityQueryOptions) {
  const itemsPerPage = options.itemsPerPage || 10;

  return useInfiniteQuery({
    queryKey: ["activities", options],
    queryFn: async ({ pageParam = 0 }) => {
      const { data: activities, error } = await supabase
        .from("user_activity_logs")
        .select("*")
        .order(options.sortField || "created_at", {
          ascending: options.sortOrder === "asc",
        })
        .range(
          pageParam * itemsPerPage,
          (pageParam * itemsPerPage) + (itemsPerPage - 1)
        );

      if (error) throw error;

      return {
        activities: activities.map(activity => ({
          id: activity.id,
          action_type: activity.action_type,
          details: activity.details as Record<string, any>,
          created_at: activity.created_at,
          user_id: activity.user_id
        })),
        nextPage: activities.length === itemsPerPage ? Number(pageParam) + 1 : undefined
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}