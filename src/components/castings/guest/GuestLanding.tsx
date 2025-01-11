import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { TalentCard } from "./TalentCard";
import { SelectionControls } from "./SelectionControls";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const GuestLanding = () => {
  const { castingId, guestId } = useParams();

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
    queryKey: ["casting-talents", castingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("casting_talents")
        .select(`
          *,
          talent:talent_profiles(
            *,
            user:users(
              first_name,
              last_name,
              avatar_url
            )
          )
        `)
        .eq("casting_id", castingId)
        .eq("availability_status", "available");

      if (error) throw error;
      return data;
    },
  });

  const { data: selections, isLoading: selectionsLoading } = useQuery({
    queryKey: ["guest-selections", castingId, guestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("guest_selections")
        .select("*")
        .eq("casting_id", castingId)
        .eq("guest_id", guestId);

      if (error) throw error;
      return data;
    },
  });

  if (castingLoading || talentsLoading || selectionsLoading) {
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
        <h1 className="text-3xl font-bold mb-2">{casting.name}</h1>
        {casting.client && (
          <p className="text-gray-600">Client: {casting.client.full_name}</p>
        )}
        {casting.briefing && (
          <div className="mt-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: casting.briefing }} />
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {talents?.map((talentData) => (
          <TalentCard
            key={talentData.talent.id}
            talent={talentData.talent}
            selection={selections?.find(s => s.talent_id === talentData.talent_id)}
            onSelect={(selection) => {
              // Handle selection
              console.log('Selection:', selection);
            }}
          />
        ))}
      </div>
    </div>
  );
};