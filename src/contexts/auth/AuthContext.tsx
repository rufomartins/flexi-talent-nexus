import { createContext } from "react";
import { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add a displayName to help with React DevTools debugging
AuthContext.displayName = 'AuthContext';