import { useAuth } from "@/contexts/auth";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Briefcase,
  MessageSquare,
  DollarSign,
  Calendar,
  Settings,
  Search,
  UserPlus,
  Inbox,
  UserCog
} from "lucide-react";

export const AppSidebar = () => {
  const location = useLocation();
  const { user, userDetails } = useAuth();
  
  const isAdmin = userDetails?.role === 'admin' || userDetails?.role === 'super_admin';
  const isSuperUser = userDetails?.role === 'super_user';
  const isSuperAdmin = userDetails?.role === 'super_admin';

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="h-full py-4">
      <nav className="space-y-2 px-4">
        <Link
          to="/dashboard"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
            isActive('/dashboard') ? "bg-gray-100 text-gray-900" : ""
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/talents"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
            isActive('/talents') ? "bg-gray-100 text-gray-900" : ""
          )}
        >
          <Users className="h-4 w-4" />
          <span>Talents</span>
        </Link>

        <Link
          to="/search"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
            isActive('/search') ? "bg-gray-100 text-gray-900" : ""
          )}
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </Link>

        <Link
          to="/add-talent"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
            isActive('/add-talent') ? "bg-gray-100 text-gray-900" : ""
          )}
        >
          <UserPlus className="h-4 w-4" />
          <span>Add new talent</span>
        </Link>

        <Link
          to="/castings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
            isActive('/castings') ? "bg-gray-100 text-gray-900" : ""
          )}
        >
          <FileText className="h-4 w-4" />
          <span>Castings</span>
        </Link>

        <Link
          to="/projects"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
            isActive('/projects') ? "bg-gray-100 text-gray-900" : ""
          )}
        >
          <Briefcase className="h-4 w-4" />
          <span>Projects</span>
        </Link>

        <Link
          to="/messages"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
            isActive('/messages') ? "bg-gray-100 text-gray-900" : ""
          )}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Messages</span>
        </Link>

        {(isSuperAdmin || isSuperUser) && (
          <>
            <Link
              to="/onboarding/admin"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                isActive('/onboarding/admin') ? "bg-gray-100 text-gray-900" : ""
              )}
            >
              <UserCog className="h-4 w-4" />
              <span>Onboarding</span>
            </Link>

            <Link
              to="/inbox"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ml-6",
                isActive('/inbox') ? "bg-gray-100 text-gray-900" : ""
              )}
            >
              <Inbox className="h-4 w-4" />
              <span>Inbox</span>
            </Link>
          </>
        )}

        {isAdmin && (
          <Link
            to="/financial"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
              isActive('/financial') ? "bg-gray-100 text-gray-900" : ""
            )}
          >
            <DollarSign className="h-4 w-4" />
            <span>Financial</span>
          </Link>
        )}

        <Link
          to="/calendar"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
            isActive('/calendar') ? "bg-gray-100 text-gray-900" : ""
          )}
        >
          <Calendar className="h-4 w-4" />
          <span>Calendar</span>
        </Link>

        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
            isActive('/settings') ? "bg-gray-100 text-gray-900" : ""
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
};