import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import type { BookingDetailsData } from "./types";

interface TalentInfoProps {
  booking: BookingDetailsData;
}

export function TalentInfo({ booking }: TalentInfoProps) {
  const talent = booking.talent_profiles?.users;

  if (!talent) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Talent Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={talent.avatar_url || ""} alt={talent.full_name} />
            <AvatarFallback>{talent.full_name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{talent.full_name}</h3>
            <p className="text-sm text-muted-foreground">{talent.email}</p>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <Button variant="outline" className="w-full" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Contact Talent
          </Button>
        </div>

        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-medium mb-2">Fee Information</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Talent Fee:</span>
              <span>${booking.talent_fee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Final Fee:</span>
              <span>${booking.final_fee}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}