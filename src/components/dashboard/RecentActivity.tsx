import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ActivityFilters } from "./activity/ActivityFilters";
import { ActivityList } from "./activity/ActivityList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['recent-activities', currentPage, activityType, dateRange, sortField, sortOrder],
    queryFn: async () => {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact' })
        .order(sortField, { ascending: sortOrder === 'asc' })
        .range(from, to);

      if (activityType) {
        if (activityType.startsWith('new_registration_')) {
          query = query.eq('action_type', 'registration')
            .eq('details->status', activityType.replace('new_registration_', ''));
        } else if (activityType.startsWith('project_')) {
          query = query.eq('action_type', 'project')
            .eq('details->status', activityType.replace('project_', ''));
        }
      }

      if (dateRange) {
        const startOfDay = new Date(dateRange);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(dateRange);
        endOfDay.setHours(23, 59, 59, 999);

        query = query.gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString());
      }

      const { data: activities, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return { 
        activities: activities as ActivityLog[], 
        totalCount: count || 0 
      };
    }
  });

  useEffect(() => {
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
          toast({
            title: "New Activity",
            description: "A new activity has been recorded",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / itemsPerPage) : 0;

  return (
    <div className="mt-8">
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

      <div className="bg-card rounded-lg shadow p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load activities. Please try again later.
            </AlertDescription>
          </Alert>
        )}
        
        <ActivityList
          activities={data?.activities || []}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          error={error}
        />
      </div>
    </div>
  );
};