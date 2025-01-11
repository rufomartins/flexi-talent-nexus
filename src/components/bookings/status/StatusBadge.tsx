import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/types/booking";

interface StatusBadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusColors: Record<BookingStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  confirmed: "default",
  completed: "default",
  cancelled: "destructive"
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'px-3 py-1'
  };

  return (
    <Badge 
      variant={statusColors[status]}
      className={sizeClasses[size]}
    >
      {status}
    </Badge>
  );
};