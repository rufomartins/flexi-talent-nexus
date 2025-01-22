import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterContext } from "../context";
import { PROJECT_STATUSES } from "../constants";

export function StatusFilter({ className }: { className?: string }) {
  const { filters, updateFilter } = useFilterContext();

  return (
    <div className={className}>
      <Select
        value={filters.status[0] || ""}
        onValueChange={(value) => updateFilter("status", [value])}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {PROJECT_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}