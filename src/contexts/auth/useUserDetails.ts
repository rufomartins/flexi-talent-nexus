import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DatabaseUser } from '@/types/user';

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState<DatabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchUserDetails = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      console.log("[useUserDetails] Starting fetch for user details:", { 
        userId,
        timestamp: new Date().toISOString()
      });

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        console.error("[useUserDetails] Invalid UUID format:", userId);
        throw new Error("Invalid user ID format");
      }

      // First verify if session exists
      const { data: { session } } = await supabase.auth.getSession();
      console.log("[useUserDetails] Current session state:", {
        hasSession: !!session,
        sessionUser: session?.user?.id,
        requestedUser: userId
      });

      if (!session) {
        console.error("[useUserDetails] No active session found");
        throw new Error("No active session");
      }

      // Fetch user data with detailed error logging
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          role,
          status,
          full_name,
          email,
          avatar_url,
          company_id,
          first_name,
          last_name,
          gender,
          mobile_phone,
          nationality,
          created_at,
          last_login,
          phone_number_verified,
          sms_notifications_enabled,
          sms_notification_types
        `)
        .eq('id', userId)
        .maybeSingle();

      if (userError) {
        console.error("[useUserDetails] Error fetching user details:", {
          error: userError,
          userId,
          errorCode: userError.code,
          hint: userError.hint,
          details: userError.details
        });
        throw userError;
      }

      if (!userData) {
        console.warn("[useUserDetails] No user details found for ID:", userId);
        return null;
      }

      console.log("[useUserDetails] Successfully fetched user details:", {
        id: userData.id,
        email: userData.email,
        role: userData.role
      });
      
      return userData;
    } catch (error) {
      console.error("[useUserDetails] Exception in fetchUserDetails:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { 
    userDetails, 
    setUserDetails, 
    fetchUserDetails,
    isLoading 
  };
};