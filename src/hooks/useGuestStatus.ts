import { useMemo } from "react";
import type { TalentProfile } from "@/types/talent";
import type { GuestSelection } from "@/types/supabase/guest-selection";

export function useGuestStatus(talents?: TalentProfile[], selections?: Record<string, GuestSelection>) {
  return useMemo(() => ({
    total: talents?.length ?? 0,
    selected: Object.keys(selections ?? {}).length,
    favorites: Object.values(selections ?? {}).filter(s => s.liked).length,
    pending: Object.values(selections ?? {}).filter(s => s.status === 'pending').length
  }), [talents, selections]);
}