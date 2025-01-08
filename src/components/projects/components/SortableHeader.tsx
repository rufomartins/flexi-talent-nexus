import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { SortConfig } from "../types/filters";

interface SortableHeaderProps {
  column: string;
  label: string;
  sortConfig: SortConfig;
  onSort: (column: string) => void;
}

export function SortableHeader({ column, label, sortConfig, onSort }: SortableHeaderProps) {
  const isActive = sortConfig.column === column;
  const isAsc = isActive && sortConfig.direction === 'asc';

  return (
    <Button
      variant="ghost"
      className="flex items-center gap-1 hover:bg-muted"
      onClick={() => onSort(column)}
    >
      {label}
      {isActive && (isAsc ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
    </Button>
  );
}