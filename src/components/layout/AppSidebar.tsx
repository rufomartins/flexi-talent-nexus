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
  
  // Memoize role-based visibility to prevent unnecessary recalculations
  const { 
    isOnboardingVisible, 
    isSettingsVisible, 
    isDashboardVisible, 
    isTalentsVisible, 
    isCastingsVisible,
    isFinancialVisible 
  } = useMemo(() => {
    const role = userDetails?.role || user?.user_metadata?.role;
    
    return {
      isOnboardingVisible: ['super_admin', 'super_user'].includes(role),
      isSettingsVisible: role === 'super_admin',
      isDashboardVisible: true, // Dashboard visible to all authenticated users
      isTalentsVisible: ['super_admin', 'admin', 'super_user'].includes(role),
      isCastingsVisible: ['super_admin', 'admin', 'super_user'].includes(role),
      isFinancialVisible: ['super_admin', 'admin'].includes(role)
    };
  }, [userDetails?.role, user?.user_metadata?.role]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2 p-4 pt-6">
            {isDashboardVisible && (
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

            {isTalentsVisible && (
              <>
                <Link
                  to="/talents"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start"
                  )}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Talents
                </Link>

                <Link
                  to="/search"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start"
                  )}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Link>

                <Link
                  to="/talents/new"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start"
                  )}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Talent
                </Link>
              </>
            )}

            {isCastingsVisible && (
              <Link
                to="/castings"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "justify-start"
                )}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Castings
              </Link>
            )}

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

            {isFinancialVisible && (
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
            )}

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

            {isOnboardingVisible && (
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

            {isSettingsVisible && (
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