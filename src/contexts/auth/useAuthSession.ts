import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useDebounce } from "@/hooks/useDebounce";

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Debounce session updates to prevent rapid re-renders
  const debouncedSession = useDebounce(session, 300);

  useEffect(() => {
    let mounted = true;
    let authListener: any = null;

    const initializeAuth = async () => {
      try {
        console.info("[Auth] Starting auth initialization...");
        
        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (mounted) {
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
          }
          setLoading(false);
        }

        // Setup auth state change listener
        authListener = supabase.auth.onAuthStateChange((_event, session) => {
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          }
        });

      } catch (err) {
        console.error("[Auth] Error during initialization:", err);
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      mounted = false;
      console.info("[Auth] Cleaning up auth state subscription");
      if (authListener) {
        authListener.data?.subscription?.unsubscribe();
      }
    };
  }, []);

  return {
    session: debouncedSession,
    user,
    loading,
    error,
    setSession,
    setUser,
    setLoading
  };
};