import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ViewControls } from "../talent-display/ViewControls";
import { FilterControls } from "../FilterControls";
import type { FilterState, GuestViewSettings } from "@/types/guest-filters";

interface FilterSectionProps {
  viewSettings: GuestViewSettings;
  filters: FilterState;
  onViewChange: (settings: GuestViewSettings) => void;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  viewSettings,
  filters,
  onViewChange,
  onFilterChange,
}) => {
  const handleViewModeChange = (mode: "grid" | "list") => {
    onViewChange({ ...viewSettings, view_mode: mode });
  };

  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <div className="grid gap-4">
          <ViewControls
            viewMode={viewSettings.view_mode}
            onViewChange={handleViewModeChange}
            sortOption={{
              field: viewSettings.sort_by,
              direction: viewSettings.sort_direction,
            }}
            onSortChange={(sort) =>
              onViewChange({
                ...viewSettings,
                sort_by: sort.field,
                sort_direction: sort.direction,
              })
            }
          />
          <FilterControls
            filters={filters}
            viewSettings={viewSettings}
            onViewChange={onViewChange}
            onFilterChange={onFilterChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};