import { useState } from "react";
import { TalentSearchFilters } from "@/types/talent-search";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

interface FilterPanelProps {
  filters: TalentSearchFilters;
  onChange: (filters: TalentSearchFilters) => void;
}

const CATEGORIES = [
  { label: "UGC", value: "UGC" },
  { label: "Translator", value: "Translator" },
  { label: "Reviewer", value: "Reviewer" },
  { label: "Voice Over", value: "VO" },
];

const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export const FilterPanel = ({ filters, onChange }: FilterPanelProps) => {
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category as TalentSearchFilters['categories'][0]]
      : filters.categories.filter(c => c !== category);
    
    onChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handleStatusChange = (status: string) => {
    onChange({
      ...filters,
      status: status as TalentSearchFilters['status'],
    });
  };

  const handleAvailabilityChange = (date: Date | undefined, type: 'start' | 'end') => {
    onChange({
      ...filters,
      availability: {
        ...filters.availability,
        [type]: date ? format(date, 'yyyy-MM-dd') : undefined,
      },
    });
  };

  const clearFilters = () => {
    onChange({
      categories: [],
      status: undefined,
      availability: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4 mr-2" />
          Clear filters
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={category.value}
                  checked={filters.categories.includes(category.value as any)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={category.value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={filters.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Availability</Label>
          <Popover open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.availability?.start
                  ? `${filters.availability.start} - ${filters.availability.end || 'Select end'}`
                  : "Select dates"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: filters.availability?.start ? new Date(filters.availability.start) : undefined,
                  to: filters.availability?.end ? new Date(filters.availability.end) : undefined,
                }}
                onSelect={(range) => {
                  handleAvailabilityChange(range?.from, 'start');
                  handleAvailabilityChange(range?.to, 'end');
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};