import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import type { Language } from "../types";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  languages: Language[];
  onApplyFilters: (filters: TaskFilters) => void;
  initialFilters?: TaskFilters;
}

interface TaskFilters {
  languageId?: string;
  translationStatus?: string;
  reviewStatus?: string;
  talentStatus?: string;
  dateRange?: DateRange;
}

const translationStatusOptions = ["Pending", "In Progress", "Completed"];
const reviewStatusOptions = ["Internal Review", "Client Review", "Approved"];
const talentStatusOptions = ["Booked", "Shooting", "Delivered"];

export function FilterDialog({ 
  open, 
  onOpenChange, 
  languages,
  onApplyFilters,
  initialFilters = {}
}: FilterDialogProps) {
  const [filters, setFilters] = useState<TaskFilters>(initialFilters);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialFilters.dateRange
  );

  const handleApplyFilters = () => {
    onApplyFilters({
      ...filters,
      dateRange,
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({});
    setDateRange(undefined);
    onApplyFilters({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Tasks</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <Select
              value={filters.languageId}
              onValueChange={(value) => setFilters({ ...filters, languageId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.language_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Translation Status</label>
            <Select
              value={filters.translationStatus}
              onValueChange={(value) => setFilters({ ...filters, translationStatus: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {translationStatusOptions.map((status) => (
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
              onValueChange={(value) => setFilters({ ...filters, reviewStatus: value })}
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
              onValueChange={(value) => setFilters({ ...filters, talentStatus: value })}
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
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
