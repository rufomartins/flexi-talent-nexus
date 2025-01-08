import { MetricsCards } from "./MetricsCards";
import { ActivityList } from "./ActivityList";

export function ProjectOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <MetricsCards />
        <ActivityList />
      </div>
      <div className="space-y-6">
        {/* Right sidebar content - will be implemented later */}
      </div>
    </div>
  );
}