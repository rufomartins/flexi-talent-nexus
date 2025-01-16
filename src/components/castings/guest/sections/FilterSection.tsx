import { Card, CardContent } from "@/components/ui/card";
import { ViewControls } from "../talent-display/ViewControls";
import { FilterControls } from "../FilterControls";
import type { FilterSectionProps } from "@/types/guest-content";

export const FilterSection: React.FC<FilterSectionProps> = ({
  viewSettings,
  filters,
  onViewChange,
  onFilterChange
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <div className="grid gap-4">
          <ViewControls
            viewSettings={viewSettings}
            onViewChange={onViewChange}
          />
          <FilterControls
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};