import { useState, useEffect } from "react";
import { ActivityFilters } from "./activity/ActivityFilters";
import { ActivityList } from "./activity/ActivityList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useActivityQuery } from "@/hooks/useActivityQuery";
import { ActivityRealtime } from "./activity/ActivityRealtime";
import type { SortField, SortOrder } from "@/types/activity";

export const RecentActivity = () => {
  const [activityType, setActivityType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<Date | undefined>();
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const itemsPerPage = 10;

  const { ref, inView } = useInView({
    threshold: 0.5,
    delay: 100,
  });

  const { 
    data, 
    isLoading, 
    error, 
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useActivityQuery({
    activityType,
    dateRange,
    sortField,
    sortOrder,
    itemsPerPage
  });

  useEffect(() => {
    if (inView && hasNextPage && !isLoading && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage]);

  const allActivities = data?.pages.flatMap(page => page.activities) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="mt-8 animate-fade-in">
      <ActivityRealtime onUpdate={refetch} />
      
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
              activities={allActivities}
              isLoading={isLoading}
              currentPage={1}
              totalPages={totalPages}
              onPageChange={() => {}} // No longer needed with infinite scroll
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