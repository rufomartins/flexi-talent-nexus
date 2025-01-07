import { Skeleton } from "@/components/ui/skeleton";
import { ActivityListItem } from "./ActivityListItem";
import { ActivityPagination } from "./ActivityPagination";

interface ActivityListProps {
  activities: Array<{
    id: string;
    action_type: string;
    created_at: string;
    details?: {
      status?: string;
      name?: string;
      project?: string;
      [key: string]: any;
    } | null;
  }>;
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ActivityList = ({
  activities,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
}: ActivityListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start space-x-4 p-4">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return null; // Error is handled by parent component
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No activities found
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity) => (
        <ActivityListItem key={activity.id} activity={activity} />
      ))}
      
      <div className="mt-4 flex justify-center">
        <ActivityPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};