import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface CandidateFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}

export function CandidateFilters({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
}: CandidateFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search candidates..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="emailed">Emailed</SelectItem>
          <SelectItem value="interviewed">Interviewed</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="not_interested">Not Interested</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}