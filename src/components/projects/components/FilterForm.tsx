import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterState } from "../types/filters";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

type ProjectTranslationStatus = Database["public"]["Enums"]["project_translation_status"];
type ProjectReviewStatus = Database["public"]["Enums"]["project_review_status"];

interface FilterFormProps {
  filters: FilterState;
  onUpdateFilters: (filters: Partial<FilterState>) => void;
  onReset: () => void;
  onClose: () => void;
}

export function FilterForm({ filters, onUpdateFilters, onReset, onClose }: FilterFormProps) {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Language</label>
        <Select
          value={filters.language || ""}
          onValueChange={(value) => onUpdateFilters({ language: value || null })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Translation Status</label>
        <Select
          value={filters.translationStatus || ""}
          onValueChange={(value) => 
            onUpdateFilters({ 
              translationStatus: (value as ProjectTranslationStatus) || null 
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Review Status</label>
        <Select
          value={filters.reviewStatus || ""}
          onValueChange={(value) => 
            onUpdateFilters({ 
              reviewStatus: (value as ProjectReviewStatus) || null 
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Internal Review">Internal Review</SelectItem>
            <SelectItem value="Client Review">Client Review</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
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
                !filters.dateRange.start && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange.start ? (
                filters.dateRange.end ? (
                  <>
                    {format(filters.dateRange.start, "LLL dd, y")} -{" "}
                    {format(filters.dateRange.end, "LLL dd, y")}
                  </>
                ) : (
                  format(filters.dateRange.start, "LLL dd, y")
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
              defaultMonth={filters.dateRange.start || undefined}
              selected={{
                from: filters.dateRange.start || undefined,
                to: filters.dateRange.end || undefined
              }}
              onSelect={(range) => 
                onUpdateFilters({
                  dateRange: {
                    start: range?.from || null,
                    end: range?.to || null
                  }
                })
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
        <Button onClick={onClose}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}