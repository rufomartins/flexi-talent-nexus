import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface ProjectMetricsProps {
  projects: any[]; // Will be properly typed once we have the full Project type
}

export function ProjectMetrics({ projects }: ProjectMetricsProps) {
  const metrics = [
    {
      title: "Active Projects",
      value: projects.filter((p) => p.status === "in_progress").length,
      icon: Activity,
      description: "Currently in progress",
    },
    {
      title: "Completed",
      value: projects.filter((p) => p.status === "completed").length,
      icon: CheckCircle2,
      description: "Successfully delivered",
    },
    {
      title: "Pending Review",
      value: projects.filter((p) => p.status === "review").length,
      icon: Clock,
      description: "Awaiting approval",
    },
    {
      title: "Upcoming Deadlines",
      value: projects.filter((p) => p.upcoming_deadlines_count > 0).length,
      icon: AlertCircle,
      description: "In the next 7 days",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}