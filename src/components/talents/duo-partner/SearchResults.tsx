import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { DuoPartner } from "@/types/talent";
import { Loader2 } from "lucide-react";

interface SearchResultsProps {
  results: DuoPartner[];
  isLoading: boolean;
  onSelect: (partner: DuoPartner) => void;
}

export function SearchResults({ results, isLoading, onSelect }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white border rounded-md mt-1 shadow-lg z-50">
      {results.map((result) => (
        <Button
          key={result.id}
          variant="ghost"
          className="w-full justify-start p-2 hover:bg-gray-100"
          onClick={() => onSelect(result)}
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={result.avatar_url} alt={result.first_name} />
              <AvatarFallback>{result.first_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="font-medium">
                {`${result.first_name} ${result.last_name}`}
              </span>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}