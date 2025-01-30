import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CandidateListHeaderProps {
  onSearch: (query: string) => void;
}

export function CandidateListHeader({ onSearch }: CandidateListHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            className="pl-9"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}