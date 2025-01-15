import { TalentGridProps } from "./types";
import { TalentCard } from "./TalentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function TalentGrid({ talents, selections, onSelect, isLoading }: TalentGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {talents.map((talent) => (
        <TalentCard
          key={talent.id}
          talent={talent}
          view="grid"
          selection={selections[talent.id]}
          onPreferenceSet={async (talentId, order) => await onSelect(talentId, { preference_order: order })}
          onCommentAdd={async (talentId, comment) => await onSelect(talentId, { comments: comment })}
        />
      ))}
    </div>
  );
}