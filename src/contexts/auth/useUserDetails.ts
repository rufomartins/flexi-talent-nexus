import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const { toast } = useToast();

  const fetchUserDetails = async (userId: string) => {
    try {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        console.error("[Auth] Invalid UUID format:", userId);
        return null;
      }

      // For debugging, try hardcoded ID first
      const debugQuery = supabase
        .from('users')
        .select('*')
        .eq('id', '183c7a85-74ce-41c8-ba7e-06a4b0a32d4e');
      console.log("[Auth] Debug query:", debugQuery);

      console.log("[Auth] Fetching user details with validated UUID:", userId);
      
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("[Auth] Error fetching user details:", error);
        console.log("[Auth] Failed query params - id:", userId);
        toast({
          title: "Error",
          description: "Failed to load user details. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      if (!data) {
        console.error("[Auth] No user details found for ID:", userId);
        return null;
      }

      console.log("[Auth] User details fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("[Auth] Exception in fetchUserDetails:", error);
      return null;
    }
  };

  return { userDetails, setUserDetails, fetchUserDetails };
};