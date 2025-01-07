import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ActivityFilters } from "./activity/ActivityFilters";
import { ActivityList } from "./activity/ActivityList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useInView } from "react-intersection-observer";

type SortOrder = 'desc' | 'asc';
type SortField = 'created_at' | 'action_type';

type ActivityLog = {
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
};

export const RecentActivity = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activityType, setActivityType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<Date | undefined>();
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const { toast } = useToast();
  const itemsPerPage = 10;

  // Infinite scroll setup
  const { ref, inView } = useInView({
    threshold: 0.5,
    delay: 100,
  });

  const buildQuery = useCallback(() => {
    const from = (currentPage - 1) * itemsPerPage;
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
  }, [activityType, dateRange, sortField, sortOrder, currentPage, itemsPerPage]);

  const { data, isLoading, error, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } = useQuery({
    queryKey: ['recent-activities', currentPage, activityType, dateRange, sortField, sortOrder],
    queryFn: async () => {
      const query = buildQuery();
      const { data: activities, error, count } = await query;

      if (error) {
        console.error('Error fetching activities:', error);
        throw new Error(error.message);
      }

      return {
        activities: activities as ActivityLog[],
        totalCount: count || 0,
        hasMore: activities?.length === itemsPerPage
      };
    },
    keepPreviousData: true,
    staleTime: 30000, // Cache data for 30 seconds
    retry: 2,
  });

  // Handle infinite scroll
  useEffect(() => {
    if (inView && data?.hasMore && !isLoading && !isFetchingNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [inView, data?.hasMore, isLoading, isFetchingNextPage]);

  // Real-time updates with debounced toast notifications
  useEffect(() => {
    let toastTimeout: NodeJS.Timeout;
    const channel = supabase
      .channel('activity-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_activity_logs'
        },
        () => {
          refetch();
          
          // Debounced toast notification
          clearTimeout(toastTimeout);
          toastTimeout = setTimeout(() => {
            toast({
              title: "New Activity",
              description: "New activities have been recorded",
              duration: 3000,
            });
          }, 1000);
        }
      )
      .subscribe();

    return () => {
      clearTimeout(toastTimeout);
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / itemsPerPage) : 0;

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <div className="flex items-center gap-4">
          <ActivityFilters
            activityType={activityType}
            setActivityType={setActivityType}
            dateRange={dateRange}
            setDateRange={setDateRange}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-lg p-6 transition-all duration-200 hover:shadow-xl">
        {error ? (
          <Alert variant="destructive" className="mb-4 animate-shake">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              Failed to load activities. Please try again later.
              {error instanceof Error && (
                <button 
                  onClick={() => refetch()} 
                  className="ml-2 text-sm underline hover:text-primary"
                >
                  Retry
                </button>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <ActivityList
              activities={data?.activities || []}
              isLoading={isLoading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              error={error}
            />
            
            {/* Infinite scroll loader */}
            <div ref={ref} className="py-4 flex justify-center">
              {(isLoading || isFetchingNextPage) && (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};