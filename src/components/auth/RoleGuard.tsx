import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user, userDetails } = useAuth();

  if (allowedRoles && userDetails) {
    console.log("[RoleGuard] Checking access:", {
      userRole: userDetails.role,
      allowedRoles,
      email: user?.email,
      isSuperAdmin: user?.email === 'cmartins@gtmd.studio'
    });

    if (!allowedRoles.includes(userDetails.role)) {
      console.warn("[RoleGuard] Access denied:", {
        email: user?.email,
        role: userDetails.role,
        requiredRoles: allowedRoles
      });
      
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};