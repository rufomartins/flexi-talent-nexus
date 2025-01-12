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

export function AppSidebar() {
  const { userDetails } = useAuth();
  console.log("Current user details in AppSidebar:", userDetails); // Debug log

  // Check if user has super_admin or super_user role
  const isOnboardingVisible = userDetails?.role === 'super_admin' || userDetails?.role === 'super_user';
  const isSettingsVisible = userDetails?.role === 'super_admin';

  console.log("Role-based visibility:", { // Debug log
    role: userDetails?.role,
    isOnboardingVisible,
    isSettingsVisible
  });

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
                "justify-start gap-2 px-2 w-full"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            {/* Onboarding Link - Only visible to super admin and super users */}
            {isOnboardingVisible && (
              <Link
                to="/onboarding"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "justify-start gap-2 px-2 w-full"
                )}
              >
                <UserCheck className="h-4 w-4" />
                Onboarding
              </Link>
            )}

            {/* Talents Section with Submenus */}
            <div className="flex flex-col gap-1">
              <Link
                to="/talents"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "justify-start gap-2 px-2 w-full"
                )}
              >
                <Users className="h-4 w-4" />
                Talents
              </Link>
              
              {/* Talents Submenu */}
              <div className="pl-4 flex flex-col gap-1">
                <Link
                  to="/search"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start gap-2 px-2 w-full"
                  )}
                >
                  <Search className="h-4 w-4" />
                  Search
                </Link>
                <Link
                  to="/talents/new"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start gap-2 px-2 w-full"
                  )}
                >
                  <UserPlus className="h-4 w-4" />
                  Add New Talent
                </Link>
              </div>
            </div>

            {/* Castings Link */}
            <Link
              to="/castings"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start gap-2 px-2 w-full"
              )}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Castings
            </Link>

            {/* Projects Link */}
            <Link
              to="/projects"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start gap-2 px-2 w-full"
              )}
            >
              <Briefcase className="h-4 w-4" />
              Projects
            </Link>

            {/* Messages Link */}
            <Link
              to="/messages"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start gap-2 px-2 w-full"
              )}
            >
              <MessageSquare className="h-4 w-4" />
              Messages
            </Link>

            {/* Financial Link */}
            <Link
              to="/financial"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start gap-2 px-2 w-full"
              )}
            >
              <DollarSign className="h-4 w-4" />
              Financial
            </Link>

            {/* Calendar Link */}
            <Link
              to="/calendar"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start gap-2 px-2 w-full"
              )}
            >
              <Calendar className="h-4 w-4" />
              Calendar
            </Link>

            {/* Settings Link - Only visible to super admin */}
            {isSettingsVisible && (
              <Link
                to="/settings"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "justify-start gap-2 px-2 w-full"
                )}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}