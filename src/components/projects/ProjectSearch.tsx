import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProjectFilterPanel } from "./ProjectFilterPanel";
import { useDebounce } from "@/hooks/useDebounce";
import type { ProjectFilters } from "./types";

interface ProjectSearchProps {
  onSearch: (query: string) => void;
  onFilter: (filters: ProjectFilters) => void;
}

export function ProjectSearch({ onSearch, onFilter }: ProjectSearchProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilter = (filters: ProjectFilters) => {
    onFilter(filters);
    setIsFilterOpen(false);
  };

  React.useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <div className="flex gap-2 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search projects..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            Filters
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <ProjectFilterPanel
            onApplyFilters={handleFilter}
            onClose={() => setIsFilterOpen(false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}