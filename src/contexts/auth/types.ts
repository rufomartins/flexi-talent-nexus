import { Session, User } from "@supabase/supabase-js";

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userDetails: any | null;
  setUserDetails: (details: any) => void;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: Error | null;
  setSession?: (session: Session | null) => void;
  setUser?: (user: User | null) => void;
  setLoading?: (loading: boolean) => void;
  setError?: (error: Error | null) => void;
}