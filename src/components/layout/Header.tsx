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
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/integrations/supabase/types"

export const Header = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileClick = () => {
    console.log("Profile clicked")
  }

  const handleSettingsClick = () => {
    console.log("Settings clicked")
  }

  return (
    <header className="h-16 bg-white border-b">
      <div className="h-full flex">
        <div className="w-64 flex-shrink-0 border-r flex items-center px-6">
          <span className="text-xl font-semibold">GTMD.studio</span>
        </div>
        
        <div className="flex-1 flex items-center justify-between px-6">
          <div className="flex-1 flex justify-center max-w-xl">
            <div className="w-full max-w-sm flex items-center">
              <Input
                type="search"
                placeholder="Quick find..."
                className="h-9"
              />
              <Button variant="ghost" size="icon" className="h-9 w-9 ml-1">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
