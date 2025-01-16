import { useState } from "react";
import { HeaderSection } from "./sections/HeaderSection";
import { FilterSection } from "./sections/FilterSection";
import { SelectionSection } from "./sections/SelectionSection";
import { ShareSection } from "./sections/ShareSection";
import { ExportDialog } from "./export/ExportDialog";
import { ShareDialog } from "./share/ShareDialog";
import type { GuestContentProps } from "@/types/guest-filters";

export const GuestContent: React.FC<GuestContentProps> = ({
  talents,
  selections,
  viewSettings,
  filters,
  isLoading,
  onSelect,
  onViewChange,
  onFilterChange,
  castingId
}) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleExport = () => {
    setIsExportDialogOpen(true);
  };

  const handleShare = () => {
    setIsShareDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <HeaderSection
        totalSelected={Object.keys(selections).length}
        onExport={handleExport}
        onShare={handleShare}
      />

      <FilterSection
        viewSettings={viewSettings}
        filters={filters}
        onViewChange={onViewChange}
        onFilterChange={onFilterChange}
      />

      <SelectionSection
        talents={talents}
        selections={selections}
        viewMode={viewSettings.view_mode}
        isLoading={isLoading}
        onSelect={onSelect}
      />

      <ShareSection castingId={castingId} />

      <ExportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        onExport={async () => {}}
      />

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        onShare={async () => {}}
        isSharing={false}
      />
    </div>
  );
};