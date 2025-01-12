import { TalentListProps } from "./types";
import { TalentCard } from "./TalentCard";
import { Skeleton } from "@/components/ui/skeleton";

export function TalentList({ talents, selections, onSelect, isLoading, showDetailedInfo }: TalentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border rounded-lg">
            <Skeleton className="h-24 w-24 rounded-md" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!talents.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No talents found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {talents.map((talent) => (
        <TalentCard
          key={talent.id}
          talent={talent}
          view="list"
          selection={selections[talent.id]}
          onSelect={async (selection) => await onSelect(talent.id, selection)}
        />
      ))}
    </div>
  );
}