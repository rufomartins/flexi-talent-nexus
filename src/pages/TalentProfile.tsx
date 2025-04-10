
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Home, ChevronRight, MoreVertical, MessageSquare } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TalentProfileTabs } from "@/components/talents/TalentProfileTabs";
import { ExperienceTab } from "@/components/talents/ExperienceTab";
import { SummaryTab } from "@/components/talents/SummaryTab";
import { ContactTab } from "@/components/talents/ContactTab";
import { MediaTab } from "@/components/talents/MediaTab";
import { CastingsTab } from "@/components/talents/CastingsTab";
import { GDPRTab } from "@/components/talents/GDPRTab";
import { CalendarTab } from "@/components/talents/CalendarTab";
import { Loader2 } from "lucide-react";
import { TalentProfileData } from "@/types/talent-profile";
import { useToast } from "@/hooks/use-toast";

const TalentProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("summary");
  const { toast } = useToast();

  const { data: talent, isLoading, refetch } = useQuery({
    queryKey: ["talent", id],
    queryFn: async () => {
      const { data: talentData, error } = await supabase
        .from("talent_profiles")
        .select(`
          *,
          user:users!user_id (*)
        `)
        .eq("user_id", id)
        .single();

      if (error) throw error;

      return {
        user: talentData.user,
        talent_profile: {
          category: talentData.category,
          evaluation_status: talentData.evaluation_status,
          internal_remarks: talentData.internal_remarks,
          country: talentData.country,
          whatsapp_number: talentData.whatsapp_number
        }
      } as TalentProfileData;
    },
  });

  const handleTalentPortal = () => {
    toast({
      title: "Talent Portal",
      description: "Redirecting to talent portal (feature coming soon)",
    });
  };

  const handleAddToCasting = () => {
    toast({
      title: "Add to casting",
      description: "Add to casting dialog will open here",
    });
  };

  const handleSendMessage = () => {
    toast({
      title: "Send Message",
      description: "Message dialog will open here",
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!talent) {
    return <div>Talent not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">
                    <Home className="h-4 w-4" />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/talents">Talents</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {talent.user.first_name} {talent.user.last_name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleTalentPortal}>Talent portal</Button>
              <Button variant="outline" onClick={handleSendMessage} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Actions
                    <MoreVertical className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View public profile</DropdownMenuItem>
                  <DropdownMenuItem>Download files</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete profile</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={handleAddToCasting}>+ Add to casting</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <TalentProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-6">
          {activeTab === "summary" && <SummaryTab talent={talent} />}
          {activeTab === "experience" && <ExperienceTab talent={talent} />}
          {activeTab === "media" && <MediaTab talent={talent} />}
          {activeTab === "contact" && <ContactTab talent={talent} onTalentUpdate={refetch} />}
          {activeTab === "gdpr" && <GDPRTab talent={talent} />}
          {activeTab === "castings" && <CastingsTab talent={talent} />}
          {activeTab === "calendar" && <CalendarTab talent={talent} />}
        </div>
      </div>
    </div>
  );
};

export default TalentProfile;
