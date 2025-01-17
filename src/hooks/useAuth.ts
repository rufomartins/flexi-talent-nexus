import { useContext } from "react";
import { AuthContext } from "@/contexts/auth";
import { AuthContextType } from "@/contexts/auth/types";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    console.error("[useAuth] Hook was called outside of AuthProvider!");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Ensure email is always available from auth context
  if (context.user && !context.user.email) {
    console.warn("[useAuth] User object is missing email!");
  }
  
  return context;
};