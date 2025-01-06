import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TalentProfileTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const TalentProfileTabs = ({ activeTab, onTabChange }: TalentProfileTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-13">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="extra">Extra</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="gdpr">GDPR</TabsTrigger>
        <TabsTrigger value="agent">Agent</TabsTrigger>
        <TabsTrigger value="castings">Castings</TabsTrigger>
        <TabsTrigger value="social-media">Social Media</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};