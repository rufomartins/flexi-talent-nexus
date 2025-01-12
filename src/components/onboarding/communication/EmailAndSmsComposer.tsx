import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface EmailAndSmsComposerProps {
  candidateId: string;
  candidateName: string;
  email?: string;
  phone?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmailAndSmsComposer({
  candidateId,
  candidateName,
  email,
  phone,
  open,
  onOpenChange,
}: EmailAndSmsComposerProps) {
  const [activeTab, setActiveTab] = useState<'email' | 'sms'>('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (activeTab === 'email' && !email) {
      toast({
        title: "Error",
        description: "No email address available for this candidate",
        variant: "destructive",
      });
      return;
    }

    if (activeTab === 'sms' && !phone) {
      toast({
        title: "Error",
        description: "No phone number available for this candidate",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    if (activeTab === 'email' && !subject.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subject",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const processedMessage = message.replace(/{candidateName}/g, candidateName);

      const { error } = await supabase.functions.invoke('send-communication', {
        body: {
          type: activeTab,
          to: activeTab === 'email' ? email : phone,
          subject: activeTab === 'email' ? subject : undefined,
          message: processedMessage,
          candidateId,
          metadata: {
            communicationType: activeTab
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${activeTab === 'email' ? 'Email' : 'SMS'} sent successfully`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error sending communication:', error);
      toast({
        title: "Error",
        description: `Failed to send ${activeTab === 'email' ? 'email' : 'SMS'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Communication</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'email' | 'sms')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" disabled={!email}>Email</TabsTrigger>
            <TabsTrigger value="sms" disabled={!phone}>SMS</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Textarea
              placeholder="Message (use {candidateName} for candidate's name)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            <Textarea
              placeholder="Message (use {candidateName} for candidate's name)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send {activeTab === 'email' ? 'Email' : 'SMS'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}