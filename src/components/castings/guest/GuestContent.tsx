import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Share2, Copy, CheckCircle } from "lucide-react";
import { ViewSettingsSection } from "./sections/ViewSettingsSection";
import { FilterSection } from "./sections/FilterSection";
import { TalentListingSection } from "./sections/TalentListingSection";
import { ExportDialog } from "./export/ExportDialog";
import { ShareDialog } from "./share/ShareDialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { exportSelections } from "@/utils/exportSelections";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { TalentProfile } from "@/types/talent";
import type { FilterState, GuestViewSettings } from "@/types/guest-filters";
import type { GuestSelection } from "@/types/supabase/guest-selection";
import type { ExportOptions } from "@/types/export";
import type { ShareConfig } from "@/types/share";
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
  const { toast } = useToast();
  const [selectedTalents, setSelectedTalents] = useState<Set<string>>(new Set());
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);

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

  const handleShare = async (config: ShareConfig) => {
    setIsSharing(true);
    try {
      const { data, error } = await supabase
        .from('share_links')
        .insert({
          casting_id: castingId,
          guest_id: guestId,
          token: crypto.randomUUID(),
          expires_at: new Date(Date.now() + config.expiresIn * 60 * 60 * 1000).toISOString(),
          allow_comments: config.allowComments,
          readonly: config.readonly,
          created_by: guestId
        })
        .select()
        .single();

      if (error) throw error;

      const shareUrl = `${window.location.origin}/share/${data.token}`;
      setShareLink(shareUrl);

      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Success",
        description: "Share link copied to clipboard",
      });

    } catch (error) {
      console.error('Error creating share link:', error);
      toast({
        title: "Error",
        description: "Failed to create share link",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Card className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <ViewSettingsSection
          viewSettings={viewSettings}
          onViewChange={onViewChange}
        />
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setIsShareDialogOpen(true)}
            disabled={Object.keys(selections).length === 0}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button onClick={() => setIsExportDialogOpen(true)} variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
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

      <ShareDialog
        open={isShareDialogOpen}
        onClose={() => {
          setIsShareDialogOpen(false);
          setShareLink(null);
        }}
        onShare={handleShare}
        isSharing={isSharing}
      />

      {shareLink && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Share link created!</AlertTitle>
          <AlertDescription>
            <div className="mt-2 flex items-center gap-2">
              <Input 
                value={shareLink} 
                readOnly 
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(shareLink);
                  toast({
                    title: "Success",
                    description: "Link copied to clipboard"
                  });
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
};

interface BatchSelectionUpdate {
  talentIds: string[];
  update: Partial<GuestSelection>;
}