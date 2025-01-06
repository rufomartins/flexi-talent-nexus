import { Header } from "@/components/layout/Header"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { User as UserIcon } from "lucide-react"
import type { Database } from "@/integrations/supabase/types"

// Type assertion helper
const assertUser = (user: unknown) => {
  return user as {
    avatar_url: string | null;
    company_id: string | null;
    created_at: string | null;
    first_name: string | null;
    full_name: string | null;
    gender: string | null;
    id: string;
    last_login: string | null;
    last_name: string | null;
    mobile_phone: string | null;
    nationality: string | null;
    role: Database['public']['Enums']['user_role'];
    status: Database['public']['Enums']['user_status'];
  };
};

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth()

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b shadow-sm z-50">
          <div className="flex h-full">
            {/* Fixed width section for logo */}
            <div className="w-64 border-r flex items-center px-6 bg-white">
              <span className="font-semibold whitespace-nowrap">GTMD.studio</span>
            </div>

            {/* Remaining header content */}
            <div className="flex-1 flex items-center justify-between px-6">
              {/* Search */}
              <div className="w-full max-w-xl">
                <div className="w-full flex items-center">
                  <input 
                    type="search" 
                    placeholder="Quick find..." 
                    className="h-8 w-full rounded-md border bg-background px-3 py-1 text-sm"
                  />
                </div>
              </div>
              
              {/* User Menu */}
              <div className="relative ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center w-10 h-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={user ? assertUser(user).avatar_url ?? '' : ''} 
                          alt={user ? `${assertUser(user).first_name ?? ''} ${assertUser(user).last_name ?? ''}` : ''} 
                        />
                        <AvatarFallback>
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex pt-14 min-h-[calc(100vh-3.5rem)]">
          {/* Left Sidebar - same width as logo section */}
          <aside className="fixed left-0 top-14 bottom-0 w-64 bg-background border-r z-40">
            <AppSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 ml-64 p-6 bg-muted/50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}