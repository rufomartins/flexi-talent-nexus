import { Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ActivityFiltersProps {
  activityType: string | null;
  setActivityType: (value: string | null) => void;
  dateRange: Date | undefined;
  setDateRange: (date: Date | undefined) => void;
}

export const ActivityFilters = ({
  activityType,
  setActivityType,
  dateRange,
  setDateRange,
}: ActivityFiltersProps) => {
  const activityTypes = [
    { value: "new_registration_approved", label: "New Registrations - Approved" },
    { value: "new_registration_evaluation", label: "New Registrations - Under Evaluation" },
    { value: "new_registration_rejected", label: "New Registrations - Rejected" },
    { value: "project_new", label: "Projects - New" },
    { value: "project_approved", label: "Projects - Approved" },
    { value: "project_revision", label: "Projects - Under Revision" }
  ];

  return (
    <div className="flex gap-2">
      <Select
        value={activityType || "all"}
        onValueChange={(value) => setActivityType(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {activityTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <Filter className="mr-2 h-4 w-4" />
            {dateRange ? format(dateRange, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={dateRange}
            onSelect={setDateRange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {(dateRange || activityType) && (
        <Button 
          variant="ghost"
          onClick={() => {
            setDateRange(undefined);
            setActivityType(null);
          }}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
};