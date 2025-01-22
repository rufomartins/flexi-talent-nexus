import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSessionManagement = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleAuthStateChange = useCallback(async (event: string, newSession: Session | null) => {
    console.log("[SessionManagement] Auth state changed:", event, newSession?.user?.email);
    
    if (newSession?.user) {
      setSession(newSession);
      setUser(newSession.user);
    } else {
      setSession(null);
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[SessionManagement] Error getting session:", error);
          throw error;
        }

        if (mounted) {
          if (initialSession) {
            console.log("[SessionManagement] Initial session found:", {
              userId: initialSession.user.id,
              email: initialSession.user.email
            });
            setSession(initialSession);
            setUser(initialSession.user);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("[SessionManagement] Session initialization error:", error);
        if (mounted) {
          toast({
            title: "Error",
            description: "Failed to initialize session. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    initializeSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange, toast]);

  return { session, user, loading, setSession, setUser, setLoading };
};