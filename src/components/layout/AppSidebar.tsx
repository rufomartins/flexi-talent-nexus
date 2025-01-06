import {
  Calendar,
  Home,
  MessageSquare,
  PlusCircle,
  Search,
  Settings,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { useLocation } from "react-router-dom"

export const AppSidebar = () => {
  const { user } = useAuth()
  const location = useLocation()

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
    },
    {
      title: "Search",
      icon: Search,
      href: "/search",
      show: true,
    },
    {
      title: "Add New Talent",
      icon: PlusCircle,
      href: "/talents/new",
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
      title: "Settings",
      icon: Settings,
      href: "/settings",
      show: user?.role === "super_admin" || user?.role === "admin",
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          {menuItems
            .filter((item) => item.show)
            .map((item) => (
              <SidebarMenuItem key={item.href}>
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
            ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}