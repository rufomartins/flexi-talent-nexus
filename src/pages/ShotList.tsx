import { ArrowLeft, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShotListHeader } from "@/components/shot-list/ShotListHeader";
import { ShotsTab } from "@/components/shot-list/ShotsTab";
import { LocationsTab } from "@/components/shot-list/LocationsTab";
import { TalentNotesTab } from "@/components/shot-list/TalentNotesTab";
import { EquipmentTab } from "@/components/shot-list/EquipmentTab";

export default function ShotList() {
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <ShotListHeader />
      
      <Tabs defaultValue="shots" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="shots"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Shots
          </TabsTrigger>
          <TabsTrigger 
            value="locations"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Locations
          </TabsTrigger>
          <TabsTrigger 
            value="talent-notes"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Talent Notes
          </TabsTrigger>
          <TabsTrigger 
            value="equipment"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Equipment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shots" className="mt-6">
          <ShotsTab />
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <LocationsTab />
        </TabsContent>

        <TabsContent value="talent-notes" className="mt-6">
          <TalentNotesTab />
        </TabsContent>

        <TabsContent value="equipment" className="mt-6">
          <EquipmentTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}