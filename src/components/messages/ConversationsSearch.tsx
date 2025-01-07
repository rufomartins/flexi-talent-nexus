import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ConversationsSearchProps {
  onSearch: (query: string) => void;
}

export function ConversationsSearch({ onSearch }: ConversationsSearchProps) {
  return (
    <div className="border-b border-chat-input-border p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
        <Input
          type="search"
          placeholder="Search conversations..."
          className="w-full pl-9 bg-background text-sm ring-offset-background placeholder:text-text-placeholder focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}