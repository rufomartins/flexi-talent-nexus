import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Home, ChevronRight, Phone, Trash2, Save, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TalentProfileData, TalentRole, TalentStatus } from "@/types/talent-profile";
import { format } from "date-fns";

const TalentProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");

  const { data: talent, isLoading } = useQuery({
    queryKey: ["talent", id],
    queryFn: async () => {
      const { data: user, error: userError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (userError) throw userError;

      const { data: talentProfile, error: profileError } = await supabase
        .from("talent_profiles")
        .select("*")
        .eq("user_id", id)
        .single();

      if (profileError) throw profileError;

      return {
        user,
        talent_profile: talentProfile,
      } as TalentProfileData;
    },
  });

  const handleSave = async () => {
    // Implementation for saving changes
    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully.",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!talent) {
    return <div>Talent not found</div>;
  }

  const talentRoles: { value: TalentRole; label: string }[] = [
    { value: "ugc_talent", label: "UGC Talent" },
    { value: "translator", label: "Translator" },
    { value: "reviewer", label: "Reviewer" },
    { value: "voice_over_artist", label: "Voice Over Artist" },
  ];

  const talentStatuses: { value: TalentStatus; label: string }[] = [
    { value: "approved", label: "Approved" },
    { value: "under_evaluation", label: "Under Evaluation" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
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
                  <BreadcrumbPage>{talent.user.full_name || 'Unknown'}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-4">
              <Button variant="outline">Talent portal</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Actions
                    <MoreVertical className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View public profile</DropdownMenuItem>
                  <DropdownMenuItem>Send message</DropdownMenuItem>
                  <DropdownMenuItem>Download files</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>+ Add to casting</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="container py-4">
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

        {/* Summary Tab Content */}
        <TabsContent value="summary" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-start gap-8">
              {/* Profile Photo Section */}
              <div className="w-64">
                <Label>Profile</Label>
                <Avatar className="w-64 h-64 mt-2">
                  <AvatarImage src={talent.user.avatar_url || undefined} />
                  <AvatarFallback>
                    {talent.user.first_name?.[0]}
                    {talent.user.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={talent.user.first_name || ''} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={talent.user.last_name || ''} readOnly />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={talent.user.email || ''} readOnly />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select defaultValue={talent.user.gender || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Actor/Talent category</Label>
                    <Select defaultValue={talent.talent_profile.category || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {talentRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Mobile Phone</Label>
                    <div className="relative">
                      <Input id="phone" defaultValue={talent.user.mobile_phone || ''} />
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue={talent.talent_profile.evaluation_status || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {talentStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="remarks">Internal Remarks</Label>
                  <Input id="remarks" defaultValue={talent.talent_profile.internal_remarks || ''} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input id="nationality" defaultValue={talent.user.nationality || ''} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <p>Created at: {talent.user.created_at ? format(new Date(talent.user.created_at), 'PPpp') : 'N/A'}</p>
                    <p>Updated at: {talent.user.updated_at ? format(new Date(talent.user.updated_at), 'PPpp') : 'N/A'}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TalentProfile;