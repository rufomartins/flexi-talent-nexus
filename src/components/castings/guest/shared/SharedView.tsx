import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { SharedTalentCard } from "./SharedTalentCard";
import type { GuestSelection } from "@/types/supabase/guest-selection";
import type { TalentProfile } from "@/types/talent";

interface SharedViewProps {
  token: string;
}

export function SharedView({ token }: SharedViewProps) {
  const { data: shareLink, isLoading: isLoadingShare } = useQuery({
    queryKey: ['share-link', token],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('share_links')
        .select(`
          *,
          casting:castings (
            id,
            name
          ),
          guest:casting_guests!casting_guests_id_fkey (
            id,
            name
          )
        `)
        .eq('token', token)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Share link not found');

      if (new Date(data.expires_at) < new Date()) {
        throw new Error('Share link has expired');
      }

      return data;
    }
  });

  const { data: selections, isLoading: isLoadingSelections } = useQuery({
    queryKey: ['shared-selections', token],
    queryFn: async () => {
      if (!shareLink) return null;

      const { data, error } = await supabase
        .from('guest_selections')
        .select(`
          *,
          talent_profiles:talent_profiles (
            *,
            users:users (
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('casting_id', shareLink.casting_id)
        .eq('guest_id', shareLink.guest_id);

      if (error) throw error;
      return data;
    },
    enabled: !!shareLink
  });

  if (isLoadingShare || isLoadingSelections) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <XCircle className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading shared selections...</span>
      </div>
    );
  }

  if (!shareLink || !selections) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <XCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-xl font-semibold mb-2">Invalid or Expired Link</h1>
        <p className="text-gray-600">This share link is no longer valid</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Shared Selections</h1>
            <p className="text-gray-600">
              Shared by {shareLink.guest.name} • 
              Expires {formatDistanceToNow(new Date(shareLink.expires_at), { addSuffix: true })}
            </p>
          </div>
          {!shareLink.readonly && (
            <Badge variant="secondary">
              View & Comment
            </Badge>
          )}
        </div>

        <div className="space-y-6">
          {selections.map((selection) => (
            <SharedTalentCard
              key={selection.talent_id}
              selection={selection as unknown as GuestSelection & {
                talent_profiles: TalentProfile & {
                  users: {
                    id: string;
                    full_name: string;
                    avatar_url?: string;
                  }
                }
              }}
              readonly={shareLink.readonly}
              allowComments={shareLink.allow_comments}
            />
          ))}
        </div>
      </div>
    </div>
  );
}