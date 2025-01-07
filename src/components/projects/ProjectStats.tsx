interface StatCard {
  title: string;
  value: number;
}

interface ProjectStatsProps {
  stats: StatCard[];
}

export function ProjectStats({ stats }: ProjectStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-lg border p-4 shadow-sm"
        >
          <div className="text-sm text-gray-500">{stat.title}</div>
          <div className="text-2xl font-bold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}