import { Input } from "@/components/ui/input";
import { useFilterContext } from "../context";

export function SearchFilter({ className }: { className?: string }) {
  const { filters, updateFilter } = useFilterContext();

  return (
    <div className={className}>
      <Input
        placeholder="Search projects..."
        value={filters.search}
        onChange={(e) => updateFilter("search", e.target.value)}
      />
    </div>
  );
}