import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { useMessaging } from "@/hooks/useMessaging";
import { Loader2 } from "lucide-react";

interface CastingMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  talentId: string;
  castingId: string;
  talentName: string;
}

export function CastingMessageDialog({
  open,
  onOpenChange,
  talentId,
  castingId,
  talentName
}: CastingMessageDialogProps) {
  const { messages, isLoading, sendMessage } = useMessaging({
    talentId,
    castingId
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Message {talentName}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <MessageList messages={messages || []} />
          )}
        </div>

        <div className="p-4 border-t">
          <MessageInput onSendMessage={sendMessage} />
        </div>
      </DialogContent>
    </Dialog>
  );
}