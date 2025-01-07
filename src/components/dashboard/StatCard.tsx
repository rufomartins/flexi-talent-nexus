import { Loader2 } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  subtitle: string;
  value: number | null;
  icon: LucideIcon;
  isLoading?: boolean;
}

export const StatCard = ({
  title,
  subtitle,
  value,
  icon: Icon,
  isLoading = false,
}: StatCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-3xl font-bold mt-4">
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          value
        )}
      </p>
    </div>
  );
};