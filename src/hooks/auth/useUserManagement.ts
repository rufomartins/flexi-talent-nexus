import { useState, useCallback } from 'react';
import { DatabaseUser } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserManagement = () => {
  const [userDetails, setUserDetails] = useState<DatabaseUser | null>(null);
  const { toast } = useToast();

  const fetchUserDetails = useCallback(async (userId: string) => {
    try {
      console.log("[UserManagement] Fetching user details for:", userId);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("[UserManagement] No active session");
        throw new Error("No active session");
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (userError) {
        console.error("[UserManagement] Error fetching user details:", userError);
        throw userError;
      }

      if (!userData) {
        console.warn("[UserManagement] No user details found for ID:", userId);
        return null;
      }

      console.log("[UserManagement] Successfully fetched user details:", {
        id: userData.id,
        email: userData.email,
        role: userData.role
      });

      return userData;
    } catch (error) {
      console.error("[UserManagement] Exception in fetchUserDetails:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user details. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  return { userDetails, setUserDetails, fetchUserDetails };
};