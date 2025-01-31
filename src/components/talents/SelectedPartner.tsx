import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { DuoPartner } from "@/types/talent";

interface SelectedPartnerProps {
  partner: DuoPartner;
  onRemove: () => void;
}

export function SelectedPartner({ partner, onRemove }: SelectedPartnerProps) {
  return (
    <div className="flex items-center justify-between p-2 border rounded-md">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={partner.users.avatar_url || ''} alt={partner.users.full_name} />
          <AvatarFallback>{partner.users.full_name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">
            {partner.users.full_name}
          </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onRemove}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}