import { Link } from "react-router-dom"
import { 
  LayoutDashboard, 
  Users, 
  Search, 
  UserPlus, 
  FileSpreadsheet, 
  Briefcase, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  Settings, 
  UserCheck 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent 
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth"
import { useMemo } from "react"

export function AppSidebar() {
  const { user, userDetails } = useAuth();
  
  console.log("[AppSidebar] Current user:", {
    id: user?.id,
    email: user?.email,
    metadata: user?.user_metadata,
    role: user?.user_metadata?.role
  });
  console.log("[AppSidebar] User details:", {
    role: userDetails?.role,
    status: userDetails?.status
  });

  // Memoize role-based visibility to prevent unnecessary recalculations
  const { isOnboardingVisible, isSettingsVisible, isDashboardVisible } = useMemo(() => {
    const role = userDetails?.role || user?.user_metadata?.role;
    console.log("[AppSidebar] Checking visibility with role:", role);
    
    const onboardingVisible = role === 'super_admin' || role === 'super_user';
    const settingsVisible = role === 'super_admin';
    const dashboardVisible = true; // Dashboard should be visible to all authenticated users
    
    console.log("[AppSidebar] Visibility flags:", {
      onboardingVisible,
      settingsVisible,
      dashboardVisible,
      role
    });
    
    return {
      isOnboardingVisible: onboardingVisible,
      isSettingsVisible: settingsVisible,
      isDashboardVisible: dashboardVisible
    };
  }, [userDetails?.role, user?.user_metadata?.role]);

  // Temporary override for debugging - remove in production
  const DEBUG_SHOW_ALL = false;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2 p-4 pt-6">
            {/* Dashboard Link - Always visible */}
            {(DEBUG_SHOW_ALL || isDashboardVisible) && (
              <Link
                to="/dashboard"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "justify-start"
                )}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            )}

            {/* Projects Link */}
            <Link
              to="/projects"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start"
              )}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Projects
            </Link>

            {/* Financial Link */}
            <Link
              to="/financial"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start"
              )}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Financial
            </Link>

            {/* Calendar Link */}
            <Link
              to="/calendar"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Link>

            {/* Onboarding Link - Conditionally rendered */}
            {(DEBUG_SHOW_ALL || isOnboardingVisible) && (
              <Link
                to="/onboarding"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "justify-start"
                )}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Onboarding
              </Link>
            )}

            {/* Settings Link - Conditionally rendered */}
            {(DEBUG_SHOW_ALL || isSettingsVisible) && (
              <Link
                to="/settings"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "justify-start"
                )}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}