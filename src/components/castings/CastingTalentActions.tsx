import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { CastingMessageDialog } from "@/components/messages/CastingMessageDialog";

interface CastingTalentActionsProps {
  talentId: string;
  castingId: string;
  talentName: string;
}

export function CastingTalentActions({ talentId, castingId, talentName }: CastingTalentActionsProps) {
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setMessageDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        Message
      </Button>

      <CastingMessageDialog
        open={messageDialogOpen}
        onOpenChange={setMessageDialogOpen}
        talentId={talentId}
        castingId={castingId}
        talentName={talentName}
      />
    </>
  );
}