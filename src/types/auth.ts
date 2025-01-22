import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { DatabaseUser } from "./user";

export interface AuthState {
  session: Session | null;
  user: SupabaseUser | null;
  userDetails: DatabaseUser | null;
  loading: boolean;
  error: Error | null;
}

export interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  setUserDetails: (details: DatabaseUser | null) => void;
  setSession?: (session: Session | null) => void;
  setUser?: (user: SupabaseUser | null) => void;
  setLoading?: (loading: boolean) => void;
}