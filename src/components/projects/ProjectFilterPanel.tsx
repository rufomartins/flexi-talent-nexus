import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from "./filters/DateRangeFilter";
import { StatusFilter } from "./filters/StatusFilter";
import { FilterSection } from "./filters/FilterSection";
import { useProjectFilters } from "./filters/useProjectFilters";
import type { FilterProps } from "./filters/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";

const scriptStatusOptions = ["Pending", "In Progress", "Approved"];
const reviewStatusOptions = ["Internal Review", "Client Review", "Approved"];
const talentStatusOptions = ["Booked", "Shooting", "Delivered", "Reshoot", "Approved"];

export function ProjectFilterPanel({ onApplyFilters, onClose, initialFilters = {} }: FilterProps) {
  const { filters, updateFilter, clearFilters } = useProjectFilters(initialFilters);
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
    clearFilters();
    setDateRange(undefined);
    onApplyFilters({});
    onClose();
  };

  return (
    <div className="w-[320px] p-4 space-y-4">
      <FilterSection label="Project Manager">
        <Select
          value={filters.projectManager}
          onValueChange={(value) => updateFilter("projectManager", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project manager" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pm1">John Doe</SelectItem>
            <SelectItem value="pm2">Jane Smith</SelectItem>
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection label="Country">
        <Select
          value={filters.country}
          onValueChange={(value) => updateFilter("country", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
          </SelectContent>
        </Select>
      </FilterSection>

      <StatusFilter
        label="Script Status"
        value={filters.scriptStatus}
        options={scriptStatusOptions}
        onChange={(value) => updateFilter("scriptStatus", value)}
      />

      <StatusFilter
        label="Review Status"
        value={filters.reviewStatus}
        options={reviewStatusOptions}
        onChange={(value) => updateFilter("reviewStatus", value)}
      />

      <StatusFilter
        label="Talent Status"
        value={filters.talentStatus}
        options={talentStatusOptions}
        onChange={(value) => updateFilter("talentStatus", value)}
      />

      <DateRangeFilter value={dateRange} onChange={setDateRange} />

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={handleClearFilters}>
          Clear
        </Button>
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
}