import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { AuthenticationGuard } from "./auth/AuthenticationGuard";
import { RoleGuard } from "./auth/RoleGuard";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  return (
    <ErrorBoundary>
      <AuthenticationGuard>
        <RoleGuard allowedRoles={allowedRoles}>
          {children}
        </RoleGuard>
      </AuthenticationGuard>
    </ErrorBoundary>
  );
};

export default ProtectedRoute;