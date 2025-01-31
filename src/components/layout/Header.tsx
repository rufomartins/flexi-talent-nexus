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
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      console.log("[Header] Starting sign out process...");
      
      // Clear all storage first to prevent any stale data
      console.log("[Header] Clearing local and session storage");
      localStorage.clear();
      sessionStorage.clear();
      
      // Perform sign out
      console.log("[Header] Executing sign out");
      await signOut();
      
      console.log("[Header] Sign out completed successfully");
      
      // Force navigation to login
      console.log("[Header] Redirecting to login page");
      navigate("/login", { replace: true });
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("[Header] Error during sign out:", error);
      toast({
        title: "Error signing out",
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
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={user?.email || "User"} />
                    <AvatarFallback>
                      <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                {user?.email && (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    {user.email}
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleProfileClick} className="cursor-pointer hover:bg-gray-100">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleSettingsClick} className="cursor-pointer hover:bg-gray-100">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onSelect={handleSignOut}
                  className="cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-700"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};