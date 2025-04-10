
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TalentListHeader } from "@/components/talents/list/TalentListHeader";
import { TalentListControls } from "@/components/talents/list/TalentListControls";
import { TalentListItem } from "@/components/talents/list/TalentListItem";
import { TalentSearchDialog } from "@/components/talents/TalentSearchDialog";
import { AddTalentModal } from "@/components/talents/AddTalentModal";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { useTalents } from "@/hooks/useTalents";
import type { TalentProfile } from "@/types/talent";
import { Loader2 } from "lucide-react";

const TalentList = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [addTalentOpen, setAddTalentOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("name");
  const { toast } = useToast();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'admin';

  // Use our enhanced useTalents hook that includes dummy data
  const { data: talents, isLoading, error } = useTalents();

  const handleSelectAll = () => {
    if (talents) {
      const allIds = new Set(talents.map(talent => talent.id));
      setSelectedIds(selectedIds.size === talents.length ? new Set() : allIds);
    }
  };

  const handleSelect = (id: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleAction = async (action: string) => {
    console.log("Action:", action, "Selected IDs:", Array.from(selectedIds));
    
    // Example of handling actions
    if (action === 'add-to-casting') {
      toast({
        title: "Adding to casting",
        description: `Adding ${selectedIds.size} talents to casting`,
      });
    } else if (action === 'email') {
      toast({
        title: "Sending email",
        description: `Preparing email for ${selectedIds.size} talents`,
      });
    } else if (action === 'delete') {
      toast({
        title: "Deleting talents",
        description: `Are you sure you want to delete ${selectedIds.size} talents?`,
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="container py-6">
        <div className="text-center text-red-600">
          Error loading talents. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-6">
      <TalentListHeader 
        onSearchOpen={() => setSearchOpen(true)}
        onAddTalentOpen={() => setAddTalentOpen(true)}
        isSuperAdmin={isSuperAdmin}
      />

      <TalentListControls
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onAction={handleAction}
      />

      {talents && talents.length > 0 ? (
        <div className="grid gap-4">
          {talents.map((talent) => (
            <TalentListItem
              key={talent.id}
              talent={talent}
              isSelected={selectedIds.has(talent.id)}
              onSelect={handleSelect}
              isSuperAdmin={isSuperAdmin}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No talents found. Add talents or adjust your search.
        </div>
      )}

      <TalentSearchDialog 
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSearch={() => {}}
      />

      <AddTalentModal
        open={addTalentOpen}
        onOpenChange={setAddTalentOpen}
      />
    </div>
  );
};

export default TalentList;
