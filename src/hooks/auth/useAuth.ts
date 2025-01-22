import { useContext } from "react";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { AuthContextValue } from "@/types/auth";

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    console.error("[useAuth] Hook was called outside of AuthProvider!");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};