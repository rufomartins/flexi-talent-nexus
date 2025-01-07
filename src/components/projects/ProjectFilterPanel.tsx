import { useState } from "react";
import { format } from "date-fns";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import type { ProjectFilters } from "./types";

interface ProjectFilterPanelProps {
  onApplyFilters: (filters: ProjectFilters) => void;
  onClose: () => void;
  initialFilters?: ProjectFilters;
}

const scriptStatusOptions = ["Pending", "In Progress", "Approved"];
const reviewStatusOptions = ["Internal Review", "Client Review", "Approved"];
const talentStatusOptions = ["Booked", "Shooting", "Delivered", "Reshoot", "Approved"];

export function ProjectFilterPanel({ 
  onApplyFilters, 
  onClose,
  initialFilters = {} 
}: ProjectFilterPanelProps) {
  const [filters, setFilters] = useState<ProjectFilters>(initialFilters);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: initialFilters.startDate || undefined,
    to: initialFilters.endDate || undefined,
  });

  const handleApplyFilters = () => {
    onApplyFilters({
      ...filters,
      startDate: dateRange?.from,
      endDate: dateRange?.to,
    });
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({});
    setDateRange(undefined);
    onApplyFilters({});
    onClose();
  };

  return (
    <div className="w-[320px] p-4 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Project Manager</label>
        <Select
          value={filters.projectManager}
          onValueChange={(value) => setFilters({ ...filters, projectManager: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project manager" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pm1">John Doe</SelectItem>
            <SelectItem value="pm2">Jane Smith</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Country</label>
        <Select
          value={filters.country}
          onValueChange={(value) => setFilters({ ...filters, country: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Language</label>
        <Select
          value={filters.language}
          onValueChange={(value) => setFilters({ ...filters, language: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Script Status</label>
        <Select
          value={filters.scriptStatus}
          onValueChange={(value) => setFilters({ ...filters, scriptStatus: value as ProjectFilters["scriptStatus"] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {scriptStatusOptions.map((status) => (
              <SelectItem key={status} value={status.toLowerCase()}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Review Status</label>
        <Select
          value={filters.reviewStatus}
          onValueChange={(value) => setFilters({ ...filters, reviewStatus: value as ProjectFilters["reviewStatus"] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {reviewStatusOptions.map((status) => (
              <SelectItem key={status} value={status.toLowerCase()}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Talent Status</label>
        <Select
          value={filters.talentStatus}
          onValueChange={(value) => setFilters({ ...filters, talentStatus: value as ProjectFilters["talentStatus"] })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {talentStatusOptions.map((status) => (
              <SelectItem key={status} value={status.toLowerCase()}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date Range</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange?.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={handleClearFilters}>
          Clear
        </Button>
        <Button onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}