import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "All Candidates", path: "/onboarding/admin" },
  { label: "Under Evaluation", path: "/onboarding/admin/evaluation" },
  { label: "Approved", path: "/onboarding/admin/approved" },
  { label: "Rejected", path: "/onboarding/admin/rejected" },
  { label: "Archived", path: "/onboarding/admin/archived" }
];

export function OnboardingNav() {
  const location = useLocation();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 overflow-x-auto py-4">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
            location.pathname === item.path
              ? "text-foreground border-b-2 border-primary"
              : "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}