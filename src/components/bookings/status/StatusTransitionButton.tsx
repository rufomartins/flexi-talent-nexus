import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BookingStatus } from "@/types/booking";

interface StatusTransitionButtonProps {
  currentStatus: BookingStatus;
  onStatusChange: (newStatus: BookingStatus) => void;
  allowedTransitions: BookingStatus[];
  isLoading?: boolean;
}

export const StatusTransitionButton: React.FC<StatusTransitionButtonProps> = ({
  currentStatus,
  onStatusChange,
  allowedTransitions,
  isLoading
}) => {
  if (allowedTransitions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Status"
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {allowedTransitions.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => onStatusChange(status)}
          >
            <Check
              className={`mr-2 h-4 w-4 ${
                currentStatus === status ? "opacity-100" : "opacity-0"
              }`}
            />
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};