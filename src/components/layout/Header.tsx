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
import { useAuth } from "@/contexts/auth"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

export const Header = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
      toast({
        title: "Success",
        description: "You have been logged out successfully.",
      });
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
    navigate('/profile');
  }

  const handleSettingsClick = () => {
    navigate('/settings');
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
              <DropdownMenuItem onSelect={handleProfileClick} className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleSettingsClick} className="cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onSelect={handleSignOut}
                className="cursor-pointer text-red-600 hover:text-red-700 focus:text-red-700 hover:bg-red-50"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};