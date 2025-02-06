import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";

export interface CandidateFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  languageFilter: string;
  onLanguageFilterChange: (value: string) => void;
}

export function CandidateFilters({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  languageFilter,
  onLanguageFilterChange,
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
      <Select
        value={statusFilter}
        onValueChange={onStatusFilterChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="emailed">Emailed</SelectItem>
          <SelectItem value="interviewed">Interviewed</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="not_interested">Not Interested</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={languageFilter}
        onValueChange={onLanguageFilterChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All languages</SelectItem>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Spanish</SelectItem>
          <SelectItem value="fr">French</SelectItem>
          <SelectItem value="de">German</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}