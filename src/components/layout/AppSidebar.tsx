import {
  Calendar,
  Home,
  MessageSquare,
  PlusCircle,
  Search,
  Settings,
  Users,
  Briefcase,
  DollarSign,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import { useLocation } from "react-router-dom"

export const AppSidebar = () => {
  const { userDetails } = useAuth()
  const location = useLocation()

  // Check if user is super_admin or admin
  const isAdminOrSuperAdmin = userDetails?.role === "super_admin" || userDetails?.role === "admin"

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
      show: true,
    },
    {
      title: "Talents",
      icon: Users,
      href: "/talents",
      show: true,
      subItems: [
        {
          title: "Search",
          icon: Search,
          href: "/talents/search",
          show: true,
        },
        {
          title: "Add New Talent",
          icon: PlusCircle,
          href: "/talents/new",
          show: true,
        },
      ],
    },
    {
      title: "Projects",
      icon: Briefcase,
      href: "/projects",
      show: true,
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/messages",
      show: true,
    },
    {
      title: "Calendar",
      icon: Calendar,
      href: "/calendar",
      show: true,
    },
    {
      title: "Financial",
      icon: DollarSign,
      href: "/financial",
      show: isAdminOrSuperAdmin,
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
      show: isAdminOrSuperAdmin,
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {menuItems
            .filter((item) => item.show)
            .map((item) => (
              <div key={item.href}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "h-12 px-4 hover:bg-muted/80",
                      location.pathname === item.href && "bg-muted text-primary"
                    )}
                  >
                    <a href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {item.subItems?.map((subItem) => (
                  <SidebarMenuItem key={subItem.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-12 px-8 hover:bg-muted/80",
                        location.pathname === subItem.href &&
                          "bg-muted text-primary"
                      )}
                    >
                      <a href={subItem.href} className="flex items-center gap-3">
                        <subItem.icon className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          {subItem.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}