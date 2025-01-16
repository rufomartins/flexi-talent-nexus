import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import type { GuestViewSettings } from "@/types/guest-filters";
import type { FilterState } from "@/types/guest-filters";
import { GuestHeader } from "./header/GuestHeader";
import { StatusBar } from "./status/StatusBar";
import { GuestContent } from "./content/GuestContent";
import { useTalents } from "@/hooks/useTalents";
import { useSelections } from "@/hooks/useSelections";
import { useGuestStatus } from "@/hooks/useGuestStatus";
import { useSelectionManagement } from "@/hooks/useSelectionManagement";

export const GuestLanding = () => {
  const { castingId, guestId } = useParams();
  const { toast } = useToast();
  
  const [viewSettings, setViewSettings] = useState<GuestViewSettings>({
    view_mode: 'grid',
    sort_by: 'name',
    sort_direction: 'asc'
  });
  
  const [filters, setFilters] = useState<FilterState>({
    search_term: '',
    show_only_available: false,
    filter_out_rejected: false,
    show_only_approved_auditions: false
  });

  const { data: talents, isLoading: talentsLoading } = useTalents(castingId!);
  const { data: selections, isLoading: selectionsLoading } = useSelections(castingId!, guestId!);
  const status = useGuestStatus(talents, selections);

  const {
    updateSelection,
    updateMultipleSelections,
    reorderSelections,
    removeSelection,
    isUpdating,
    error: selectionError
  } = useSelectionManagement({
    castingId: castingId!,
    guestId: guestId!,
    onError: (error) => {
      console.error('Selection management error:', error);
      toast({
        title: "Error",
        description: "Failed to update selection",
        variant: "destructive"
      });
    }
  });

  const handleExport = () => {
    try {
      toast({
        title: "Export Started",
        description: "Your export is being processed"
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "There was an error processing your export",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    try {
      toast({
        title: "Share Successful",
        description: "Invitation has been sent"
      });
    } catch (error) {
      console.error("Share failed:", error);
      toast({
        title: "Share Failed",
        description: "There was an error sharing the casting",
        variant: "destructive"
      });
    }
  };

  if (talentsLoading || selectionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!castingId || !guestId) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Missing required parameters. Please check the URL.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <GuestHeader
        castingName="Talent Selection"
        totalSelected={status.selected}
        onExport={handleExport}
        onShare={handleShare}
      />

      <StatusBar status={status} />

      <GuestContent
        talents={talents ?? []}
        selections={selections ?? {}}
        viewSettings={viewSettings}
        filters={filters}
        isLoading={talentsLoading || selectionsLoading}
        castingId={castingId}
        guestId={guestId}
        onSelectionUpdate={updateSelection}
        onMultipleUpdate={updateMultipleSelections}
        onReorder={reorderSelections}
        onRemove={removeSelection}
        isUpdating={isUpdating}
        onFilterChange={setFilters}
        onViewChange={setViewSettings}
      />
    </div>
  );
};