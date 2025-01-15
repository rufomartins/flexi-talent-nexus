import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileDown, Share } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { TalentProfile } from "@/types/talent";
import type { FilterState, GuestViewSettings } from "@/types/guest-filters";
import type { GuestSelection } from "@/types/supabase/guest-selection";
import type { ExportConfig } from "@/types/supabase/export";
import { TalentDisplay } from "./talent-display/TalentDisplay";
import { ExportDialog } from "./export/ExportDialog";
import { ShareDialog } from "./share/ShareDialog";

interface GuestHeaderProps {
  castingName: string;
  totalSelected: number;
  onExport: () => void;
  onShare: () => void;
}

const GuestHeader: React.FC<GuestHeaderProps> = ({
  castingName,
  totalSelected,
  onExport,
  onShare
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">{castingName}</h1>
        <p className="text-gray-600">
          Selected: {totalSelected} talents
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={onExport} variant="outline">
          <FileDown className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button onClick={onShare}>
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

interface StatusBarProps {
  status: {
    total: number;
    selected: number;
    favorites: number;
  };
}

const StatusBar: React.FC<StatusBarProps> = ({ status }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Talents</CardTitle>
          <div className="text-2xl font-bold">{status.total}</div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Selected</CardTitle>
          <div className="text-2xl font-bold">{status.selected}</div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Favorites</CardTitle>
          <div className="text-2xl font-bold">{status.favorites}</div>
        </CardHeader>
      </Card>
    </div>
  );
};

interface GuestContentWrapperProps {
  talents: TalentProfile[];
  selections: Record<string, GuestSelection>;
  viewSettings: GuestViewSettings;
  filters: FilterState;
  isLoading: boolean;
  onSelectionUpdate: (talentId: string, selection: Partial<GuestSelection>) => Promise<void>;
  castingId: string;
  guestId: string;
}

const GuestContentWrapper: React.FC<GuestContentWrapperProps> = (props) => {
  return (
    <div className="space-y-6">
      <TalentDisplay 
        {...props}
        viewMode={props.viewSettings.view_mode}
        onSelect={props.onSelectionUpdate}
        sort={{
          field: props.viewSettings.sort_by,
          direction: props.viewSettings.sort_direction
        }}
      />
    </div>
  );
};

export const GuestLanding = () => {
  const { castingId, guestId } = useParams();
  const { toast } = useToast();
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  
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

  const { data: casting, isLoading: castingLoading, error: castingError } = useQuery({
    queryKey: ["casting", castingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("castings")
        .select(`
          *,
          client:users!castings_client_id_fkey (
            id,
            full_name
          )
        `)
        .eq("id", castingId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: talents, isLoading: talentsLoading } = useQuery({
    queryKey: ["casting-talents", castingId, filters],
    queryFn: async () => {
      let query = supabase
        .from("casting_talents")
        .select(`
          *,
          talent:talent_profiles!casting_talents_talent_id_fkey(
            *,
            users!talent_profiles_user_id_fkey(
              id,
              first_name,
              last_name,
              full_name,
              avatar_url
            )
          )
        `)
        .eq("casting_id", castingId);

      if (filters.show_only_available) {
        query = query.eq("availability_status", "available");
      }

      if (filters.round_filter) {
        query = query.eq("round", filters.round_filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data;

      if (filters.search_term) {
        const searchLower = filters.search_term.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.talent?.users?.first_name?.toLowerCase().includes(searchLower) ||
          item.talent?.users?.last_name?.toLowerCase().includes(searchLower)
        );
      }

      return filteredData.map(item => {
        const talentProfile = item.talent;
        if (!talentProfile) return null;
        
        return {
          ...talentProfile,
          availability: talentProfile.availability as Record<string, any>,
          users: {
            id: talentProfile.users.id,
            full_name: talentProfile.users.full_name,
            avatar_url: talentProfile.users.avatar_url
          }
        } as TalentProfile;
      }).filter(Boolean) as TalentProfile[];
    },
  });

  const { data: selections = {}, isLoading: selectionsLoading } = useQuery({
    queryKey: ["guest-selections", castingId, guestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guest_selections")
        .select("*")
        .eq("casting_id", castingId)
        .eq("guest_id", guestId);

      if (error) throw error;

      return data.reduce((acc, selection) => ({
        ...acc,
        [selection.talent_id]: {
          id: selection.id,
          casting_id: selection.casting_id,
          talent_id: selection.talent_id,
          guest_id: selection.guest_id,
          preference_order: selection.preference_order,
          comments: selection.comments,
          is_favorite: selection.liked || false,
          created_at: selection.created_at,
          updated_at: selection.updated_at
        } as GuestSelection,
      }), {} as Record<string, GuestSelection>);
    },
  });

  const handleSelectionUpdate = async (talentId: string, selection: Partial<GuestSelection>) => {
    try {
      const { error } = await supabase
        .from("guest_selections")
        .upsert({
          casting_id: castingId,
          guest_id: guestId,
          talent_id: talentId,
          liked: selection.is_favorite,
          comments: selection.comments,
          preference_order: selection.preference_order,
          status: selection.status || 'shortlisted'
        });

      if (error) {
        console.error("Error updating selection:", error);
        toast({
          title: "Error",
          description: "Failed to update selection",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in handleSelectionUpdate:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const handleExport = async (config: ExportConfig) => {
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

  const handleShare = async (email: string, message?: string) => {
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

  const status = useMemo(() => ({
    total: talents?.length ?? 0,
    selected: Object.keys(selections ?? {}).length,
    favorites: Object.values(selections ?? {}).filter(s => s.is_favorite).length
  }), [talents, selections]);

  if (castingLoading || talentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (castingError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load casting details. Please try again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <GuestHeader
        castingName={casting?.name ?? "Talent Selection"}
        totalSelected={status.selected}
        onExport={() => setShowExportDialog(true)}
        onShare={() => setShowShareDialog(true)}
      />

      <StatusBar status={status} />

      <GuestContentWrapper
        talents={talents ?? []}
        selections={selections ?? {}}
        viewSettings={viewSettings}
        filters={filters}
        isLoading={talentsLoading}
        onSelectionUpdate={handleSelectionUpdate}
        castingId={castingId!}
        guestId={guestId!}
      />

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        castingId={castingId!}
        guestId={guestId!}
        onExport={handleExport}
      />

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        castingId={castingId!}
        onShare={handleShare}
      />
    </div>
  );
};
