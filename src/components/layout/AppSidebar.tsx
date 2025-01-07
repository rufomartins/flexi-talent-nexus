import { Link } from "react-router-dom"
import { LayoutDashboard, Users, Search, UserPlus, FileSpreadsheet, Briefcase, MessageSquare, Calendar, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-1">
            {/* Dashboard Link */}
            <Link
              to="/dashboard"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start gap-2 px-2"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            {/* Talents Link */}
            <Link
              to="/talents"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start gap-2 px-2"
              )}
            >
              <Users className="h-4 w-4" />
              Talents
            </Link>

            {/* Search Link */}
            <Link
              to="/search"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start gap-2 px-2"
              )}
            >
              <Search className="h-4 w-4" />
              Search
            </Link>

            {/* Add New Talent Link */}
            <Link
              to="/talents/new"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start gap-2 px-2"
              )}
            >
              <UserPlus className="h-4 w-4" />
              Add New Talent
            </Link>

            {/* Castings Link */}
            <Link
              to="/castings"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start gap-2 px-2"
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
                "justify-start gap-2 px-2"
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
                "justify-start gap-2 px-2"
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
                "justify-start gap-2 px-2"
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
                "justify-start gap-2 px-2"
              )}
            >
              <Calendar className="h-4 w-4" />
              Calendar
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}