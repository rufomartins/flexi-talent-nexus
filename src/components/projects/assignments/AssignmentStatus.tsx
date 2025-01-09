import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface AssignmentStatusProps {
  currentStatus: string;
  onStatusUpdate: (status: string) => void;
  roleType: 'translator' | 'reviewer' | 'ugc_talent';
}

export function AssignmentStatus({ currentStatus, onStatusUpdate, roleType }: AssignmentStatusProps) {
  const getStatusOptions = () => {
    switch (roleType) {
      case 'translator':
        return ['Pending', 'In Progress', 'Completed'];
      case 'reviewer':
        return ['Internal Review', 'Client Review', 'Approved'];
      case 'ugc_talent':
        return ['Booked', 'Shooting', 'Delivered', 'Reshoot', 'Approved'];
      default:
        return [];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
      case 'Shooting':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
      case 'Internal Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reshoot':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Current Status:</span>
        <Badge className={getStatusColor(currentStatus)} variant="secondary">
          {currentStatus}
        </Badge>
      </div>

      <div className="flex items-center gap-4">
        <Select onValueChange={onStatusUpdate} value={currentStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select new status" />
          </SelectTrigger>
          <SelectContent>
            {getStatusOptions().map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}