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
  const { userDetails } = useAuth();

  // Memoize role-based visibility to prevent unnecessary recalculations
  const { isOnboardingVisible, isSettingsVisible } = useMemo(() => ({
    isOnboardingVisible: userDetails?.role === 'super_admin' || userDetails?.role === 'super_user',
    isSettingsVisible: userDetails?.role === 'super_admin'
  }), [userDetails?.role]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2 p-4 pt-6">
            {/* Dashboard Link - Always visible */}
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

            {/* Talents Section */}
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
              to="/add-talent"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start"
              )}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add new talent
            </Link>

            {/* Castings Link */}
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

            {/* Messages Link */}
            <Link
              to="/messages"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start"
              )}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Link>

            {/* Users Link */}
            <Link
              to="/users"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start"
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              Users
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

            {/* Settings Link - Conditionally rendered */}
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