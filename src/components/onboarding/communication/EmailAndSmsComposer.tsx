import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { smsService } from "@/services/smsService";
import { NotificationType } from "@/types/notifications";
import { Progress } from "@/components/ui/progress";

interface EmailAndSmsComposerProps {
  candidateId: string;
  candidateName: string;
  phone?: string;
  email?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'email' | 'sms';
  selectedCandidates?: Array<{
    id: string;
    name: string;
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
  const [progress, setProgress] = useState(0);
  const maxSmsLength = 160;

  const processMessageTemplate = (msg: string, candidateData: any) => {
    let processedMessage = msg;
    // Replace template variables
    processedMessage = processedMessage.replace(/{name}/g, candidateData.name || '');
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
    const failures: string[] = [];
    const totalCandidates = selectedCandidates.length;
    let processed = 0;

    try {
      if (mode === 'sms') {
        const candidates = selectedCandidates.length > 0 ? selectedCandidates : [{ id: candidateId, name: candidateName, phone }];
        
        for (const candidate of candidates) {
          if (!candidate.phone) {
            console.warn(`Skipping SMS for candidate ${candidate.id} - no phone number`);
            failures.push(`${candidate.name} (no phone number)`);
            processed++;
            setProgress((processed / totalCandidates) * 100);
            continue;
          }

          try {
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

            // Update communication status
            await supabase
              .from('onboarding_candidates')
              .update({ communication_status: 'sms_sent' })
              .eq('id', candidate.id);

          } catch (error) {
            console.error(`Failed to send SMS to ${candidate.name}:`, error);
            failures.push(candidate.name);
          }

          processed++;
          setProgress((processed / totalCandidates) * 100);
        }

        if (failures.length === 0) {
          toast({
            title: "Success",
            description: `SMS sent to ${candidates.length} candidate(s)`,
          });
        } else {
          toast({
            title: "Partial Success",
            description: `Failed to send SMS to: ${failures.join(', ')}`,
            variant: "destructive",
          });
        }
      }

      if (failures.length === 0) {
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error('Error sending messages:', error);
      toast({
        title: "Error sending messages",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
      setProgress(0);
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
            {selectedCandidates.length > 1 && (
              <div className="text-sm text-muted-foreground">
                Sending to {selectedCandidates.length} recipients
              </div>
            )}
          </div>
          {isSending && progress > 0 && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Sending messages... {Math.round(progress)}%
              </p>
            </div>
          )}
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