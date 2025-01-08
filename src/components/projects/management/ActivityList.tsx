import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

export function ActivityList() {
  const activities = [
    {
      id: 1,
      type: "task_completed",
      title: "Video Translation Completed",
      description: "Finnish translation for 'Product Demo' completed",
      timestamp: "2 hours ago",
      icon: CheckCircle2,
      iconColor: "text-green-500",
    },
    {
      id: 2,
      type: "review_rejected",
      title: "Review Rejected",
      description: "German translation needs revision",
      timestamp: "4 hours ago",
      icon: XCircle,
      iconColor: "text-red-500",
    },
    {
      id: 3,
      type: "task_assigned",
      title: "New Task Assigned",
      description: "Swedish translation assigned to John Doe",
      timestamp: "6 hours ago",
      icon: Clock,
      iconColor: "text-blue-500",
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className={`mt-1 ${activity.iconColor}`}>
              <activity.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}