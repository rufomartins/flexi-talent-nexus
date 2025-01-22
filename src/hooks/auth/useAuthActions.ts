import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DatabaseUser } from '@/types/user';

interface AuthActionsProps {
  setLoading: (loading: boolean) => void;
  setSession: (session: any) => void;
  setUser: (user: any) => void;
  setUserDetails: (details: DatabaseUser | null) => void;
  setError: (error: Error | null) => void;
  fetchUserDetails: (userId: string) => Promise<DatabaseUser | null>;
}

export const useAuthActions = ({
  setLoading,
  setSession,
  setUser,
  setUserDetails,
  setError,
  fetchUserDetails
}: AuthActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const signIn = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    console.log("[Auth] Attempting sign in for:", email);
    try {
      setLoading(true);
      setError(null);
      
      // Clear any existing session data first
      console.log("[Auth] Clearing any existing session data");
      localStorage.clear();
      sessionStorage.clear();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("[Auth] Sign in error:", error);
        setError(error);
        throw error;
      }

      console.log("[Auth] Sign in successful, session established:", {
        userId: data.user?.id,
        email: data.user?.email
      });

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      if (data.user) {
        console.log("[Auth] Fetching user details for:", data.user.id);
        const userDetails = await fetchUserDetails(data.user.id);
        if (!userDetails) {
          console.error("[Auth] Failed to fetch user details after login");
          throw new Error("Failed to fetch user details");
        }
        
        // Navigate to dashboard after successful login
        navigate('/dashboard', { replace: true });
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      console.error("[Auth] Sign in error:", error);
      setError(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, fetchUserDetails, navigate, toast]);

  const signOut = useCallback(async () => {
    console.log("[Auth] Starting sign out process");
    setLoading(true);
    try {
      // Clear all state first
      console.log("[Auth] Clearing application state");
      setSession(null);
      setUser(null);
      setUserDetails(null);
      setError(null);
      
      // Clear all local storage
      console.log("[Auth] Clearing local storage");
      localStorage.clear();
      sessionStorage.clear();
      
      // Kill all active sessions in Supabase
      console.log("[Auth] Killing all Supabase sessions");
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error("[Auth] Supabase signOut error:", error);
        setError(error);
        throw error;
      }
      
      console.log("[Auth] Successfully signed out from Supabase");
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });

      console.log("[Auth] Navigating to login page");
      // Use replace to prevent going back to the previous page
      navigate('/login', { replace: true });
    } catch (error: any) {
      console.error("[Auth] Sign out error:", error);
      setError(error);
      toast({
        title: "Error",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setSession, setUser, setUserDetails, setError, navigate, toast]);

  return { signIn, signOut };
};