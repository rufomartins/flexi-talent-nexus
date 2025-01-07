import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const RecentActivity = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recent activities:', error);
        return [];
      }

      return data;
    }
  });

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      <div className="bg-card rounded-lg shadow p-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : activities && activities.length > 0 ? (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {activity.action_type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No recent activity to display
          </p>
        )}
      </div>
    </div>
  );
};