import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Video } from "lucide-react";

interface MessageDialogHeaderProps {
  talentName: string;
  onVideoCall: () => void;
}

export function MessageDialogHeader({ talentName, onVideoCall }: MessageDialogHeaderProps) {
  return (
    <DialogHeader className="flex flex-row justify-between items-center">
      <DialogTitle>Chat with {talentName}</DialogTitle>
      <Button
        variant="outline"
        size="icon"
        onClick={onVideoCall}
      >
        <Video className="h-4 w-4" />
      </Button>
    </DialogHeader>
  );
}