import { TalentProfile } from "@/types/talent";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface SearchResultsProps {
  results: TalentProfile[];
  isLoading: boolean;
  onSelect: (talentId: string) => void;
  selectedIds?: Set<string>;
  onSelectionChange?: (id: string) => void;
}

export const SearchResults = ({ 
  results, 
  isLoading, 
  onSelect,
  selectedIds = new Set(),
  onSelectionChange
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">No talents found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {results.map((talent) => (
        <Card
          key={talent.id}
          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelect(talent.id)}
        >
          <div className="flex items-start space-x-4">
            {onSelectionChange && (
              <Checkbox
                checked={selectedIds.has(talent.id)}
                onCheckedChange={() => onSelectionChange(talent.id)}
                onClick={(e) => e.stopPropagation()}
                className="mt-1"
              />
            )}
            <Avatar className="h-12 w-12">
              <AvatarImage src={talent.users.avatar_url || ''} />
              <AvatarFallback>
                {talent.users.full_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">
                  {talent.users.full_name}
                </p>
                <Badge variant="secondary" className="ml-2">
                  {talent.talent_category}
                </Badge>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                <p className="truncate">{talent.country}</p>
                <p className="mt-1">
                  <Badge 
                    variant={
                      talent.evaluation_status === 'approved' 
                        ? 'default' 
                        : talent.evaluation_status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {talent.evaluation_status}
                  </Badge>
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};