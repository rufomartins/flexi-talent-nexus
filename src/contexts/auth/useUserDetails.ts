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
      console.log("[useUserDetails] Starting fetch for user details:", { userId });
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        console.error("[useUserDetails] Invalid UUID format:", userId);
        toast({
          title: "Error",
          description: "Invalid user ID format",
          variant: "destructive",
        });
        return null;
      }

      // First try to get from users table which has RLS policies
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          first_name,
          last_name,
          avatar_url,
          role,
          status,
          gender,
          nationality,
          mobile_phone,
          company_id,
          created_at,
          last_login,
          phone_number_verified,
          sms_notifications_enabled,
          sms_notification_types
        `)
        .eq('id', userId)
        .maybeSingle();

      if (userError) {
        console.error("[useUserDetails] Error fetching user details:", userError);
        console.log("[useUserDetails] Failed query params - id:", userId);
        
        // Only show toast for non-404 errors
        if (userError.code !== 'PGRST116') {
          toast({
            title: "Error",
            description: "Failed to load user details. Please try again.",
            variant: "destructive",
          });
        }
        return null;
      }

      if (!userData) {
        console.warn("[useUserDetails] No user details found for ID:", userId);
        // Try to get basic info from auth.users as fallback
        const { data: { user: authUser } } = await supabase.auth.getUser(userId);
        
        if (authUser) {
          // Create minimal user details from auth data
          const minimalUserData: DatabaseUser = {
            id: authUser.id,
            full_name: authUser.user_metadata?.full_name || '',
            role: 'user',
            status: 'active',
            created_at: authUser.created_at,
            last_login: authUser.last_sign_in_at,
            sms_notifications_enabled: false,
            phone_number_verified: false,
            sms_notification_types: [],
            // Initialize all nullable fields
            avatar_url: null,
            company_id: null,
            first_name: null,
            last_name: null,
            gender: null,
            mobile_phone: null,
            nationality: null
          };
          console.log("[useUserDetails] Created minimal user data from auth:", minimalUserData);
          return minimalUserData;
        }
        return null;
      }

      console.log("[useUserDetails] Fetched user details successfully:", {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        isSuperAdmin: userData.role === 'super_admin'
      });
      return userData as DatabaseUser;
    } catch (error) {
      console.error("[useUserDetails] Exception in fetchUserDetails:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading user details",
        variant: "destructive",
      });
      return null;
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