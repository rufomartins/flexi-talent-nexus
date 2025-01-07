import { Loader2 } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  subtitle: string;
  value: number | null;
  icon: LucideIcon;
  isLoading?: boolean;
  navigateTo?: string;
}

export const StatCard = ({
  title,
  subtitle,
  value,
  icon: Icon,
  isLoading = false,
  navigateTo,
}: StatCardProps) => {
  const navigate = useNavigate();

  return (
    <div 
      className={cn(
        "bg-card rounded-lg shadow p-6",
        navigateTo && "cursor-pointer hover:bg-muted/50 transition-colors"
      )}
      onClick={() => navigateTo && navigate(navigateTo)}
    >
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