import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { AuthContextType } from "./types";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    console.error("[useAuth] Hook was called outside of AuthProvider!");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};