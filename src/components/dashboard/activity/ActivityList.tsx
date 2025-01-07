import { Loader2, AlertCircle } from "lucide-react";
import { Json } from "@/integrations/supabase/types";
import { ActivityListItem } from "./ActivityListItem";
import { ActivityPagination } from "./ActivityPagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface Activity {
  id: string;
  action_type: string;
  details: Json;
  created_at: string;
}

interface ActivityListProps {
  activities: Activity[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  error?: Error | null;
}

export const ActivityList = ({
  activities,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  error
}: ActivityListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-3">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message || 'An error occurred while loading activities'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!activities.length) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No recent activity to display
      </p>
    );
  }

  return (
    <>
      <ul className="space-y-4">
        {activities.map((activity) => (
          <ActivityListItem key={activity.id} activity={activity} />
        ))}
      </ul>
      
      <ActivityPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};