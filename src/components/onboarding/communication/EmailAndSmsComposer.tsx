import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { smsService } from "@/services/smsService";
import { NotificationType } from "@/types/notifications";

interface EmailAndSmsComposerProps {
  candidateId: string;
  candidateName: string; // Added this prop
  phone?: string;
  email?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'email' | 'sms';
  selectedCandidates?: Array<{
    id: string;
    phone?: string;
  }>;
}

export function EmailAndSmsComposer({
  candidateId,
  candidateName,
  phone,
  email,
  open,
  onOpenChange,
  mode = 'sms',
  selectedCandidates = []
}: EmailAndSmsComposerProps) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const maxSmsLength = 160;

  const processMessageTemplate = (msg: string, candidateData: any) => {
    let processedMessage = msg;
    // Add any template processing logic here
    return processedMessage;
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      if (mode === 'sms') {
        // Handle bulk SMS sending
        const candidates = selectedCandidates.length > 0 ? selectedCandidates : [{ id: candidateId, phone }];
        
        for (const candidate of candidates) {
          if (!candidate.phone) {
            console.warn(`Skipping SMS for candidate ${candidate.id} - no phone number`);
            continue;
          }

          const processedMessage = processMessageTemplate(message, candidate);
          
          await smsService.sendSMS(
            candidate.phone,
            processedMessage,
            NotificationType.STATUS_CHANGE,
            {
              candidateId: candidate.id,
              communicationType: 'sms'
            }
          );
        }

        toast({
          title: "Success",
          description: `SMS sent to ${candidates.length} candidate(s)`,
        });
      }

      onOpenChange(false);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send {mode.toUpperCase()}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Textarea
              placeholder={`Type your ${mode} message here...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
            {mode === 'sms' && (
              <div className="text-sm text-muted-foreground">
                {message.length}/{maxSmsLength} characters
              </div>
            )}
          </div>
          <Button 
            onClick={handleSend} 
            disabled={isSending || !message.trim() || (mode === 'sms' && message.length > maxSmsLength)}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              `Send ${mode.toUpperCase()}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}