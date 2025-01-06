import { cn } from "@/lib/utils";

interface TalentProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TalentProfileTabs = ({ activeTab, onTabChange }: TalentProfileTabsProps) => {
  return (
    <div className="border-b">
      <nav className="-mb-px flex space-x-8">
        {[
          { id: "summary", label: "Summary" },
          { id: "experience", label: "Experience" },
          { id: "media", label: "Media" },
          { id: "appearance", label: "Appearance" },
          { id: "contact", label: "Contact" },
          { id: "extra", label: "Extra" },
          { id: "skills", label: "Skills" },
          { id: "files", label: "Files" },
          { id: "gdpr", label: "GDPR" },
          { id: "agent", label: "Agent" },
          { id: "castings", label: "Castings" },
          { id: "social_media", label: "Social Media" },
          { id: "calendar", label: "Calendar" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "border-b-2 py-4 px-1 text-sm font-medium",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
