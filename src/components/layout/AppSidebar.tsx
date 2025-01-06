import {
  Calendar,
  DollarSign,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
      subItems: [
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
      ],
    },
    {
      title: "Castings",
      icon: Users,
      href: "/castings",
      show: true,
    },
    {
      title: "Projects",
      icon: Home,
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
      title: "Users",
      icon: Users,
      href: "/users",
      show: true,
    },
    {
      title: "Financial",
      icon: DollarSign,
      href: "/financial",
      show: user?.role === "super_admin" || user?.role === "admin",
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
      show: true,
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
                    location.pathname === item.href && "bg-accent text-accent-foreground"
                  )}
                >
                  <a href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.subItems && (
                  <SidebarMenuSub>
                    {item.subItems
                      .filter((subItem) => subItem.show)
                      .map((subItem) => (
                        <SidebarMenuSubItem key={subItem.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={location.pathname === subItem.href}
                          >
                            <a href={subItem.href}>
                              <subItem.icon className="h-4 w-4" />
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}