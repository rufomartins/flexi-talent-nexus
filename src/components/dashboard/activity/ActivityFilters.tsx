import { CalendarIcon, ArrowUpDown } from "lucide-react";
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

type SortOrder = 'desc' | 'asc';
type SortField = 'created_at' | 'action_type';

interface ActivityFiltersProps {
  activityType: string | null;
  setActivityType: (type: string | null) => void;
  dateRange: Date | undefined;
  setDateRange: (date: Date | undefined) => void;
  sortField: SortField;
  setSortField: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

export const ActivityFilters = ({
  activityType,
  setActivityType,
  dateRange,
  setDateRange,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}: ActivityFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <Select
        value={activityType || "all"}
        onValueChange={(value) => setActivityType(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Activities</SelectItem>
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

      <Select
        value={sortField}
        onValueChange={(value) => setSortField(value as SortField)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at">Date</SelectItem>
          <SelectItem value="action_type">Activity Type</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="h-9 w-9"
      >
        <ArrowUpDown className="h-4 w-4" />
      </Button>

      {(dateRange || activityType || sortField !== 'created_at' || sortOrder !== 'desc') && (
        <Button
          variant="ghost"
          onClick={() => {
            setDateRange(undefined);
            setActivityType(null);
            setSortField('created_at');
            setSortOrder('desc');
          }}
          className="h-8 px-2 lg:px-3"
        >
          Reset filters
        </Button>
      )}
    </div>
  );
};