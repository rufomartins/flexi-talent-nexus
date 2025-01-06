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

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()

  return (
    <SidebarProvider>
      <div className="min-h-screen">
        {/* Header - full width fixed */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b shadow-sm z-50 flex items-center">
          {/* Header content with left padding for logo area */}
          <div className="w-64 flex-shrink-0 px-6">
            <span className="font-semibold whitespace-nowrap">GTMD.studio</span>
          </div>
          
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
                        src={user ? user.avatar_url ?? '' : ''} 
                        alt={user ? `${user.first_name ?? ''} ${user.last_name ?? ''}` : ''} 
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
        </header>

        <div className="flex h-screen pt-14">
          {/* Sidebar - fixed with exact width matching logo area */}
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
