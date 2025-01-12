import { useState, useEffect, useRef } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const initTimeoutRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);

  useEffect(() => {
    let mounted = true;
    mountedRef.current = true;

    const initializeAuth = async () => {
      try {
        console.log("[Auth] Starting auth initialization...");
        
        // Set timeout for initialization
        initTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current && loading) {
            console.error("[Auth] Initialization timeout reached");
            setLoading(false);
            toast({
              title: "Error",
              description: "Authentication initialization timed out. Please refresh the page.",
              variant: "destructive",
            });
          }
        }, 15000); // 15 seconds timeout

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("[Auth] Session fetch error:", error);
          throw error;
        }

        if (!mounted) {
          console.log("[Auth] Component unmounted during initialization");
          return;
        }

        if (session?.user) {
          console.log("[Auth] Valid session found for user:", session.user.id);
          setSession(session);
          setUser(session.user);
        } else {
          console.log("[Auth] No valid session found");
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error("[Auth] Initialization error:", error);
        if (mounted) {
          toast({
            title: "Error",
            description: "Failed to initialize authentication.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          console.log("[Auth] Initialization complete, setting loading to false");
          setLoading(false);
          if (initTimeoutRef.current) {
            clearTimeout(initTimeoutRef.current);
          }
        }
      }
    };

    initializeAuth();

    return () => {
      console.log("[Auth] Cleaning up auth session");
      mounted = false;
      mountedRef.current = false;
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [loading, toast]);

  return { session, user, loading, setSession, setUser, setLoading };
};