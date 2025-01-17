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

      // Fetch only essential user data first
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          role,
          status,
          full_name,
          email
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

      // Create minimal user details
      const userDetails: DatabaseUser = {
        id: userData.id,
        role: userData.role,
        status: userData.status,
        full_name: userData.full_name,
        email: userData.email,
        avatar_url: null,
        company_id: null,
        first_name: null,
        last_name: null,
        gender: null,
        mobile_phone: null,
        nationality: null,
        created_at: null,
        last_login: null,
        phone_number_verified: false,
        sms_notifications_enabled: false,
        sms_notification_types: []
      };

      console.log("[useUserDetails] Successfully fetched user details:", {
        id: userDetails.id,
        email: userDetails.email,
        role: userDetails.role
      });
      
      return userDetails;
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