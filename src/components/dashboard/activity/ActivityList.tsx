import { Loader2 } from "lucide-react";
import { Json } from "@/integrations/supabase/types";
import { ActivityListItem } from "./ActivityListItem";
import { ActivityPagination } from "./ActivityPagination";

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
}

export const ActivityList = ({
  activities,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: ActivityListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
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