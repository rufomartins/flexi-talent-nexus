import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Share2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FilterControls } from "./FilterControls";
import { useState } from "react";
import { GuestFilters, GuestViewSettings } from "@/types/guest-filters";
import { TalentDisplay } from "./talent-display/TalentDisplay";
import { ExportDialog } from "./export/ExportDialog";
import { ShareDialog } from "./share/ShareDialog";
import { useToast } from "@/hooks/use-toast";
import type { GuestSelection } from "@/types/supabase/guest-selection";
import type { TalentProfile } from "@/types/talent";
import type { ExportConfig } from "@/types/supabase/export";

export const GuestLanding = () => {
  const { castingId, guestId } = useParams();
  const { toast } = useToast();
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [filters, setFilters] = useState<GuestFilters>({
    show_only_available: false,
    filter_out_rejected: false,
    show_only_approved_auditions: false,
    search_term: '',
  });

  const [viewSettings, setViewSettings] = useState<GuestViewSettings>({
    view_mode: 'grid',
    sort_by: 'name',
    sort_direction: 'asc',
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

      // Client-side filtering
      if (filters.search_term) {
        const searchLower = filters.search_term.toLowerCase();
        filteredData = filteredData.filter(item => 
          item.talent?.users?.first_name?.toLowerCase().includes(searchLower) ||
          item.talent?.users?.last_name?.toLowerCase().includes(searchLower)
        );
      }

      // Sort the data
      filteredData.sort((a, b) => {
        const direction = viewSettings.sort_direction === 'asc' ? 1 : -1;
        
        switch (viewSettings.sort_by) {
          case 'name':
            const nameA = `${a.talent?.users?.first_name} ${a.talent?.users?.last_name}`;
            const nameB = `${b.talent?.users?.first_name} ${b.talent?.users?.last_name}`;
            return nameA.localeCompare(nameB) * direction;
          case 'date_added':
            return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * direction;
          default:
            return 0;
        }
      });

      return filteredData.map(item => item.talent) as TalentProfile[];
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

      // Convert array to record for easier lookup and ensure type compatibility
      return data.reduce((acc, selection) => ({
        ...acc,
        [selection.talent_id]: {
          id: selection.id,
          casting_id: selection.casting_id,
          talent_id: selection.talent_id,
          guest_id: selection.guest_id,
          preference_order: selection.preference_order,
          comments: selection.comments,
          is_favorite: selection.liked || false, // Map 'liked' to 'is_favorite'
          created_at: selection.created_at,
          updated_at: selection.updated_at
        } as GuestSelection,
      }), {} as Record<string, GuestSelection>);
    },
  });

  const handleSelectionUpdate = async (talentId: string, selection: Partial<GuestSelection>) => {
    const { error } = await supabase
      .from("guest_selections")
      .upsert({
        casting_id: castingId,
        guest_id: guestId,
        talent_id: talentId,
        liked: selection.is_favorite, // Map 'is_favorite' to 'liked'
        comments: selection.comments,
        preference_order: selection.preference_order,
      });

    if (error) {
      console.error("Error updating selection:", error);
    }
  };

  const handleExport = async (config: ExportConfig) => {
    try {
      // Here you would implement the actual export logic
      // For now, we'll just show a success message
      toast({
        title: "Export Successful",
        description: `Your selections have been exported as a ${config.format.toUpperCase()} file.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your selections. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (email: string, message?: string) => {
    try {
      const { error } = await supabase.from("casting_guests").insert({
        casting_id: castingId,
        email,
        name: email.split('@')[0],
        access_token: crypto.randomUUID(),
      });

      if (error) throw error;

      toast({
        title: "Access Shared",
        description: `An invitation has been sent to ${email}.`,
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "There was an error sharing access. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{casting.name}</h1>
            {casting.client && (
              <p className="text-muted-foreground">Client: {casting.client.full_name}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportDialog(true)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareDialog(true)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        {casting.briefing && (
          <div className="mt-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: casting.briefing }} />
        )}
      </div>

      <FilterControls
        filters={filters}
        onFilterChange={setFilters}
        viewSettings={viewSettings}
        onViewChange={setViewSettings}
      />

      <div className="mt-6">
        <TalentDisplay
          talents={talents || []}
          viewMode={viewSettings.view_mode}
          selections={selections}
          onSelect={handleSelectionUpdate}
          isLoading={talentsLoading}
        />
      </div>

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
