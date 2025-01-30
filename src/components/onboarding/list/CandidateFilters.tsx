import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <input
          type="text"
          placeholder="Search candidates..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border rounded-md"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Candidates</SelectItem>
          <SelectItem value="under_evaluation">Under Evaluation</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}