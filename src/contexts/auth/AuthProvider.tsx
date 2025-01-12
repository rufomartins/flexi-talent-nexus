import { createContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType } from "./types";

const AUTH_TIMEOUT = 15000; // 15 seconds timeout

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const initTimeoutRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);

  const fetchUserDetails = async (userId: string) => {
    try {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(userId)) {
        console.error("[Auth] Invalid UUID format:", userId);
        return null;
      }

      console.log("[Auth] Fetching user details with validated UUID:", userId);
      
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (!mountedRef.current) {
        console.log("[Auth] Component unmounted during user details fetch");
        return null;
      }

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
        }, AUTH_TIMEOUT);

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
          
          const details = await fetchUserDetails(session.user.id);
          if (mounted) {
            if (details) {
              console.log("[Auth] Setting user details");
              setUserDetails(details);
            } else {
              console.error("[Auth] Failed to fetch user details");
              setUserDetails(null);
            }
          }
        } else {
          console.log("[Auth] No valid session found");
          setSession(null);
          setUser(null);
          setUserDetails(null);
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) {
        console.log("[Auth] Ignoring auth state change - component unmounted");
        return;
      }
      
      console.log("[Auth] Auth state changed:", event, session ? "Has session" : "No session");

      if (session?.user) {
        console.log("[Auth] Setting session and user state");
        setSession(session);
        setUser(session.user);
        
        const details = await fetchUserDetails(session.user.id);
        if (mounted) {
          if (details) {
            console.log("[Auth] Updated user details after state change");
            setUserDetails(details);
          } else {
            console.error("[Auth] Failed to fetch user details after state change");
          }
        }
      } else {
        console.log("[Auth] Clearing session and user state");
        setSession(null);
        setUser(null);
        setUserDetails(null);
        if (event === "SIGNED_OUT") {
          console.log("[Auth] User signed out, redirecting to login");
          navigate("/login", { replace: true });
        }
      }
      
      if (mounted) {
        console.log("[Auth] State change processing complete");
        setLoading(false);
      }
    });

    return () => {
      console.log("[Auth] Cleaning up auth provider");
      mounted = false;
      mountedRef.current = false;
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signOut = async () => {
    console.log("Attempting sign out");
    setLoading(true);
    try {
      setSession(null);
      setUser(null);
      setUserDetails(null);
      
      localStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase signOut error:", error);
        throw error;
      }
      
      console.log("Successfully signed out from Supabase");
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });

      console.log("Navigating to login page");
      navigate('/login', { replace: true });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "There was an error signing out.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean) => {
    console.log("Attempting sign in for:", email);
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      if (data.user) {
        const userDetails = await fetchUserDetails(data.user.id);
        if (!userDetails) {
          throw new Error("Failed to fetch user details");
        }
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userDetails,
        setUserDetails,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}