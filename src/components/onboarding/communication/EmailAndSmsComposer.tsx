import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { sendSMS } from "@/utils/sms";
import { NotificationType } from "@/types/notifications";

interface EmailAndSmsComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateId: string;
  candidateName: string;
  email?: string;
  phone?: string;
  mode?: 'email' | 'sms';
  selectedCandidates?: Array<{
    id: string;
    name: string;
    phone?: string;
    email?: string;
  }>;
}

export function EmailAndSmsComposer({
  open,
  onOpenChange,
  candidateId,
  candidateName,
  email,
  phone,
  mode = 'sms',
  selectedCandidates = []
}: EmailAndSmsComposerProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

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
      const candidates = selectedCandidates.length > 0 
        ? selectedCandidates 
        : [{ id: candidateId, name: candidateName, phone, email }];
      
      for (const candidate of candidates) {
        if (mode === 'sms' && !candidate.phone) {
          toast({
            title: "Error",
            description: `No phone number available for ${candidate.name}`,
            variant: "destructive",
          });
          continue;
        }

        if (mode === 'email' && !candidate.email) {
          toast({
            title: "Error",
            description: `No email available for ${candidate.name}`,
            variant: "destructive",
          });
          continue;
        }

        if (mode === 'sms') {
          await sendSMS({
            to: candidate.phone!,
            message,
            module: 'onboarding',
            metadata: {
              candidateId: candidate.id,
              candidateName: candidate.name
            }
          });
        }

        // Update communication status
        const { error: updateError } = await supabase
          .from('onboarding_candidates')
          .update({
            communication_status: mode === 'sms' ? 'sms_sent' : 'email_sent'
          })
          .eq('id', candidate.id);

        if (updateError) throw updateError;
      }

      toast({
        title: "Success",
        description: `${mode.toUpperCase()} sent successfully`,
      });

      onOpenChange(false);
      setMessage('');
    } catch (error: any) {
      console.error(`Error sending ${mode}:`, error);
      toast({
        title: "Error",
        description: error.message || `Failed to send ${mode}`,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Send {mode === 'sms' ? 'SMS' : 'Email'} to {selectedCandidates.length > 0 ? `${selectedCandidates.length} candidates` : candidateName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Textarea
            placeholder={`Type your ${mode} message here...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}