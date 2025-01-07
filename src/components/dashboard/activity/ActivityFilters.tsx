import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ActivityFiltersProps {
  activityType: string | null;
  setActivityType: (type: string | null) => void;
  dateRange: Date | undefined;
  setDateRange: (date: Date | undefined) => void;
}

export const ActivityFilters = ({
  activityType,
  setActivityType,
  dateRange,
  setDateRange,
}: ActivityFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <Select
        value={activityType || ""}
        onValueChange={(value) => setActivityType(value || null)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Activities</SelectItem>
          <SelectItem value="new_registration_approved">New Registration - Approved</SelectItem>
          <SelectItem value="new_registration_under_evaluation">New Registration - Under Evaluation</SelectItem>
          <SelectItem value="new_registration_rejected">New Registration - Rejected</SelectItem>
          <SelectItem value="project_new">Project - New</SelectItem>
          <SelectItem value="project_approved">Project - Approved</SelectItem>
          <SelectItem value="project_under_revision">Project - Under Revision</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange ? format(dateRange, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
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
          className="h-8 px-2 lg:px-3"
        >
          Reset filters
        </Button>
      )}
    </div>
  );
};