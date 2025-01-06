import { Search, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import type { Database } from "@/integrations/supabase/types"

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

export const Header = () => {
  const { user, signOut } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white z-50">
      <div className="h-full flex">
        {/* Logo section with fixed width */}
        <div className="w-64 flex-shrink-0 border-r border-b flex items-center px-4">
          <span className="text-xl font-semibold">GTMD.studio</span>
        </div>
        
        {/* Rest of header */}
        <div className="flex-1 border-b flex items-center justify-between px-4">
          <div className="flex-1 flex justify-center max-w-xl">
            <div className="w-full max-w-sm flex items-center">
              <Input
                type="search"
                placeholder="Quick find..."
                className="h-8 w-full"
              />
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={user ? assertUser(user).avatar_url ?? '' : ''} 
                    alt={user ? `${assertUser(user).first_name ?? ''} ${assertUser(user).last_name ?? ''}` : ''} 
                  />
                  <AvatarFallback>
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
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
  )
}