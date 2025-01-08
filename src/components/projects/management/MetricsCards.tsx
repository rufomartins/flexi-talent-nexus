import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock, AlertTriangle, ArrowUpRight } from "lucide-react";

export function MetricsCards() {
  const metrics = [
    {
      title: "Completed Tasks",
      value: "24",
      change: "+12%",
      icon: CheckCircle2,
      trend: "up",
    },
    {
      title: "In Progress",
      value: "8",
      change: "-2%",
      icon: Clock,
      trend: "down",
    },
    {
      title: "Pending Review",
      value: "6",
      icon: AlertTriangle,
      change: "0%",
      trend: "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
              <p className="text-2xl font-bold mt-2">{metric.value}</p>
            </div>
            <metric.icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">{metric.change}</span>
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        </Card>
      ))}
    </div>
  );
}