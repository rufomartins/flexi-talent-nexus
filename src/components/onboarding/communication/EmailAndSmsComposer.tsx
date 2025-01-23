import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { sendSMS } from "@/utils/sms";
import { supabase } from "@/integrations/supabase/client";
import { SmsComposer } from "./SmsComposer";
import { CandidateList } from "./CandidateList";

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

        <CandidateList selectedCandidates={selectedCandidates} />

        <SmsComposer
          message={message}
          onMessageChange={setMessage}
          onSend={handleSend}
          isSending={isSending}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}