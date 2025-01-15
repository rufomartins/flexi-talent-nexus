import { useState, useMemo } from "react";
import { ViewControls } from "./ViewControls";
import { TalentCard } from "./TalentCard";
import type { TalentDisplayProps } from "./types";
import { useToast } from "@/hooks/use-toast";

export function TalentDisplay({
  talents,
  viewMode,
  selections,
  onSelect,
  isLoading,
  savingStatus = {},
  errorMessages = {}
}: TalentDisplayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<{ field: string; direction: 'asc' | 'desc' }>({ 
    field: 'name', 
    direction: 'asc' 
  });
  const { toast } = useToast();

  const handlePreferenceSet = async (talentId: string, order: number) => {
    try {
      // Check for duplicate preference order
      const existingSelection = Object.values(selections).find(
        s => s.preference_order === order && s.talent_id !== talentId
      );
      
      if (existingSelection) {
        toast({
          title: "Duplicate Preference",
          description: `Preference order ${order} is already assigned to another talent`,
          variant: "destructive"
        });
        return;
      }

      await onSelect(talentId, { preference_order: order });
      
      toast({
        title: "Selection Saved",
        description: "Your preference has been updated",
      });
    } catch (error) {
      console.error("Error setting preference:", error);
      toast({
        title: "Error",
        description: "Failed to save your preference",
        variant: "destructive"
      });
    }
  };

  const handleCommentAdd = async (talentId: string, comment: string) => {
    try {
      await onSelect(talentId, { comments: comment });
      toast({
        title: "Comment Saved",
        description: "Your comment has been updated",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to save your comment",
        variant: "destructive"
      });
    }
  };

  const filteredAndSortedTalents = useMemo(() => {
    return talents
      .filter(talent => 
        talent.users.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talent.native_language?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOption.field === 'name') {
          return sortOption.direction === 'asc'
            ? a.users.full_name.localeCompare(b.users.full_name)
            : b.users.full_name.localeCompare(a.users.full_name);
        }
        if (sortOption.field === 'preferenceOrder') {
          const orderA = selections[a.id]?.preference_order || 0;
          const orderB = selections[b.id]?.preference_order || 0;
          return sortOption.direction === 'asc' ? orderA - orderB : orderB - orderA;
        }
        return 0;
      });
  }, [talents, searchQuery, sortOption, selections]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <ViewControls
        viewMode={viewMode}
        onViewChange={() => {}}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {filteredAndSortedTalents.map(talent => (
          <TalentCard
            key={talent.id}
            talent={talent}
            selection={selections[talent.id]}
            onPreferenceSet={handlePreferenceSet}
            onCommentAdd={handleCommentAdd}
            view={viewMode}
            isSaving={savingStatus[talent.id]}
            errorMessage={errorMessages[talent.id]}
          />
        ))}
      </div>
    </div>
  );
}