import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";

interface ProjectSearchProps {
  onSearch: (query: string) => void;
  onFilterClick: () => void;
}

export function ProjectSearch({ onSearch, onFilterClick }: ProjectSearchProps) {
  return (
    <div className="flex gap-2 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search projects..."
          className="pl-9"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Button variant="outline" size="sm" onClick={onFilterClick}>
        Filters
        <ChevronDown className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}