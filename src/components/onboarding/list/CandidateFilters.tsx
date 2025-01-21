import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CandidateFiltersProps {
  communicationFilter: string;
  onFilterChange: (value: string) => void;
}

export function CandidateFilters({ 
  communicationFilter, 
  onFilterChange 
}: CandidateFiltersProps) {
  return (
    <Select
      value={communicationFilter}
      onValueChange={onFilterChange}
    >
      <SelectTrigger className="w-[180px]">
        <Filter className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Candidates</SelectItem>
        <SelectItem value="email_sent">Email Sent</SelectItem>
        <SelectItem value="sms_sent">SMS Sent</SelectItem>
        <SelectItem value="no_response">No Response</SelectItem>
      </SelectContent>
    </Select>
  );
}