import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DatabaseUser } from '@/types/user';

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState<DatabaseUser | null>(null);
  const { toast } = useToast();

  const fetchUserDetails = async (userId: string) => {
    try {
      console.log("[useUserDetails] Starting fetch for user details:", { userId });
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        console.error("[useUserDetails] Invalid UUID format:", userId);
        return null;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("[useUserDetails] Error fetching user details:", error);
        console.log("[useUserDetails] Failed query params - id:", userId);
        
        // Only show toast for non-404 errors
        if (error.code !== 'PGRST116') {
          toast({
            title: "Error",
            description: "Failed to load user details. Please try again.",
            variant: "destructive",
          });
        }
        return null;
      }

      if (!data) {
        console.warn("[useUserDetails] No user details found for ID:", userId);
        return null;
      }

      console.log("[useUserDetails] Fetched user details successfully:", data);
      return data;
    } catch (error) {
      console.error("[useUserDetails] Exception in fetchUserDetails:", error);
      return null;
    }
  };

  return { userDetails, setUserDetails, fetchUserDetails };
};