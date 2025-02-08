
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { CandidateFiltersProps } from "@/types/onboarding";

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
        <SelectTrigger className="w-[180px] bg-white border border-gray-300 z-50">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
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
        <SelectTrigger className="w-[180px] bg-white border border-gray-300 z-50">
          <SelectValue placeholder="Filter by language" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
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
