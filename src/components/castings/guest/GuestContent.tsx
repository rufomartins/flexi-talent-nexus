import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { ViewSettingsSection } from "./sections/ViewSettingsSection";
import { FilterSection } from "./sections/FilterSection";
import { TalentListingSection } from "./sections/TalentListingSection";
import { ExportDialog } from "./export/ExportDialog";
import { exportSelections } from "@/utils/exportSelections";
import type { TalentProfile } from "@/types/talent";
import type { FilterState, GuestViewSettings } from "@/types/guest-filters";
import type { GuestSelection } from "@/types/supabase/guest-selection";
import type { ExportOptions } from "@/types/export";
import type { Dispatch, SetStateAction } from "react";

interface GuestContentProps {
  talents: TalentProfile[];
  selections: Record<string, GuestSelection>;
  viewSettings: GuestViewSettings;
  filters: FilterState;
  isLoading: boolean;
  castingId: string;
  guestId: string;
  onSelectionUpdate: (talentId: string, update: Partial<GuestSelection>) => Promise<void>;
  onMultipleUpdate: (updates: Record<string, Partial<GuestSelection>>) => Promise<void>;
  onReorder: (newOrder: Record<string, number>) => Promise<void>;
  onRemove: (talentId: string) => Promise<void>;
  onViewChange: Dispatch<SetStateAction<GuestViewSettings>>;
  onFilterChange: Dispatch<SetStateAction<FilterState>>;
}

export const GuestContent: React.FC<GuestContentProps> = ({
  talents,
  selections,
  viewSettings,
  filters,
  isLoading,
  castingId,
  guestId,
  onSelectionUpdate,
  onMultipleUpdate,
  onReorder,
  onRemove,
  onViewChange,
  onFilterChange,
}) => {
  const [selectedTalents, setSelectedTalents] = useState<Set<string>>(new Set());
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleTalentSelect = (talentId: string, selected: boolean) => {
    setSelectedTalents(prev => {
      const next = new Set(prev);
      if (selected) {
        next.add(talentId);
      } else {
        next.delete(talentId);
      }
      return next;
    });
  };

  const handleBatchUpdate = async (update: BatchSelectionUpdate) => {
    await onMultipleUpdate(
      update.talentIds.reduce((acc, talentId) => ({
        ...acc,
        [talentId]: update.update
      }), {})
    );
    setSelectedTalents(new Set());
  };

  const handleExport = async (options: ExportOptions) => {
    await exportSelections(selections, talents, options);
  };

  return (
    <Card className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <ViewSettingsSection
          viewSettings={viewSettings}
          onViewChange={onViewChange}
        />
        <Button onClick={() => setIsExportDialogOpen(true)} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <FilterSection
        filters={filters}
        onFilterChange={onFilterChange}
      />
      
      <TalentListingSection
        talents={talents}
        selections={selections}
        viewMode={viewSettings.view_mode}
        isLoading={isLoading}
        sort={{
          field: viewSettings.sort_by,
          direction: viewSettings.sort_direction
        }}
        filters={filters}
        castingId={castingId}
        guestId={guestId}
        onSelect={onSelectionUpdate}
        onMultipleSelect={onMultipleUpdate}
        onReorder={onReorder}
        onRemove={onRemove}
        selectedTalents={selectedTalents}
        onTalentSelect={handleTalentSelect}
        onBatchUpdate={handleBatchUpdate}
      />

      <ExportDialog
        open={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
      />
    </Card>
  );
};

interface BatchSelectionUpdate {
  talentIds: string[];
  update: Partial<GuestSelection>;
}