import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import type { SortField, SortDirection } from "@/types/guest-filters";

interface ViewControlsProps {
  viewMode: "grid" | "list";
  onViewChange: (mode: "grid" | "list") => void;
  sortOption: {
    field: SortField;
    direction: SortDirection;
  };
  onSortChange: (sort: {
    field: SortField;
    direction: SortDirection;
  }) => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  viewMode,
  onViewChange,
  sortOption,
  onSortChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewChange("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => onViewChange("list")}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};