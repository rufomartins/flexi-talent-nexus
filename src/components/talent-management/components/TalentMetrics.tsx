import { Users, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { StatCard } from "./StatCard"

interface TalentMetricsProps {
  stats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  isLoading?: boolean;
}

export function TalentMetrics({ stats, isLoading }: TalentMetricsProps) {
  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <StatCard
        title="Total Talents"
        value={stats?.total ?? 0}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Approved"
        value={stats?.approved ?? 0}
        icon={<CheckCircle className="h-4 w-4 text-green-500" />}
      />
      <StatCard
        title="Pending"
        value={stats?.pending ?? 0}
        icon={<Clock className="h-4 w-4 text-yellow-500" />}
      />
      <StatCard
        title="Rejected"
        value={stats?.rejected ?? 0}
        icon={<AlertCircle className="h-4 w-4 text-red-500" />}
      />
    </div>
  );
}