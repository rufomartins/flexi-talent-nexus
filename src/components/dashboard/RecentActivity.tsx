import { useState } from "react";
import { useActivityQuery } from "@/hooks/useActivityQuery";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type SortField = 'created_at' | 'action_type';
type SortOrder = 'asc' | 'desc';

export function RecentActivity() {
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data, isLoading, error } = useActivityQuery({
    activityType: 'all',
    dateRange: new Date(),
    sortField,
    sortOrder
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="text-center text-red-500">
          Error loading activities
        </div>
      </Card>
    );
  }

  const activities = data?.pages.flatMap(page => page.activities) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Activities</h2>
          <span className="text-sm text-gray-500">
            Total: {totalCount}
          </span>
        </div>
        
        {activities.map((activity) => (
          <div key={activity.id} className="border-b pb-2">
            <p className="text-sm">{activity.action_type}</p>
            <span className="text-xs text-gray-500">
              {new Date(activity.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}