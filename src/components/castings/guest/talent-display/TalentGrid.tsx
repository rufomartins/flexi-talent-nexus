import { TalentGridProps } from "./types";
import { TalentCard } from "./TalentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TalentGrid({ talents, selections, onSelect, isLoading, columnCount = 3 }: TalentGridProps) {
  if (isLoading) {
    return (
      <div className={cn(
        "grid gap-6",
        {
          'md:grid-cols-2 lg:grid-cols-3': columnCount === 3,
          'md:grid-cols-2 lg:grid-cols-4': columnCount === 4
        }
      )}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
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
    <div className={cn(
      "grid gap-6",
      {
        'md:grid-cols-2 lg:grid-cols-3': columnCount === 3,
        'md:grid-cols-2 lg:grid-cols-4': columnCount === 4
      }
    )}>
      {talents.map((talent) => (
        <TalentCard
          key={talent.id}
          talent={talent}
          view="grid"
          selection={selections[talent.id]}
          onLike={(liked) => onSelect(talent.id, { liked })}
          onComment={(comments) => onSelect(talent.id, { comments })}
          onPreferenceOrder={(preference_order) => onSelect(talent.id, { preference_order })}
        />
      ))}
    </div>
  );
}