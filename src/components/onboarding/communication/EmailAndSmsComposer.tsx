
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmailComposer } from "./EmailComposer";
import { SmsComposer } from "./SmsComposer";
import type { Step, OnboardingEmailTemplate, SmsTemplate, EmailAndSmsComposerProps } from "@/types/onboarding";

export function EmailAndSmsComposer({
  open,
  onOpenChange,
  selectedCandidates = [],
  candidateId,
  candidateName,
  email,
  phone,
  stage
}: EmailAndSmsComposerProps) {
  const [step, setStep] = useState<Step>('compose');
  const [enableSms, setEnableSms] = useState(false);
  const [emailData, setEmailData] = useState({
    templateId: '',
    subject: '',
    message: '' // Changed from body to message
  });
  const [smsData, setSmsData] = useState({
    templateId: '',
    message: ''
  });
  
  const { toast } = useToast();

  const { data: emailTemplates } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      console.log('Fetching email templates...');
      const { data, error } = await supabase
        .from('onboarding_email_templates')
        .select('id, name, type, subject, message, variables, is_active, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching email templates:', error);
        throw error;
      }

      console.log('Email templates fetched:', data);
      return data as OnboardingEmailTemplate[];
    }
  });

  const { data: smsTemplates } = useQuery({
    queryKey: ['sms-templates'],
    queryFn: async () => {
      console.log('Fetching SMS templates...');
      const { data, error } = await supabase
        .from('onboarding_sms_templates')
        .select('id, name, type, message, variables, is_active, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching SMS templates:', error);
        throw error;
      }

      console.log('SMS templates fetched:', data);
      return data as SmsTemplate[];
    }
  });

  const handleInsertTag = (tag: string) => {
    const tagText = `{{${tag}}}`;
    if (step === 'compose') {
      if (enableSms) {
        setSmsData(prev => ({
          ...prev,
          message: prev.message + tagText
        }));
      } else {
        setEmailData(prev => ({
          ...prev,
          message: prev.message + tagText // Changed from body to message
        }));
      }
    }
  };

  const handleSend = async () => {
    try {
      setStep('send');
      
      // Single candidate mode
      if (candidateId && email) {
        const { error } = await supabase.functions.invoke('send-onboarding-email', {
          body: {
            templateId: emailData.templateId,
            recipient: {
              email,
              name: candidateName
            },
            subject: emailData.subject,
            message: emailData.message // Changed from body to message
          }
        });

        if (error) throw error;

        if (enableSms && phone) {
          const { error: smsError } = await supabase.functions.invoke('send-sms', {
            body: {
              to: phone,
              message: smsData.message,
              module: 'onboarding',
              metadata: {
                candidateId,
                candidateName
              }
            }
          });

          if (smsError) throw smsError;
        }
      } else {
        // Multiple candidates mode
        const emailPromises = selectedCandidates.map(async (candidate) => {
          if (!candidate.email) return;
          
          const { error } = await supabase.functions.invoke('send-onboarding-email', {
            body: {
              templateId: emailData.templateId,
              recipient: {
                email: candidate.email,
                name: candidate.name || `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim()
              },
              subject: emailData.subject,
              message: emailData.message // Changed from body to message
            }
          });

          if (error) throw error;
        });

        const smsPromises = enableSms ? selectedCandidates.map(async (candidate) => {
          if (!candidate.phone) return;
          
          const { error } = await supabase.functions.invoke('send-sms', {
            body: {
              to: candidate.phone,
              message: smsData.message,
              module: 'onboarding',
              metadata: {
                candidateId: candidate.id,
                candidateName: candidate.name || `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim()
              }
            }
          });

          if (error) throw error;
        }) : [];

        await Promise.all([...emailPromises, ...smsPromises]);
      }

      toast({
        title: "Success",
        description: "Messages sent successfully",
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error('Error sending messages:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send messages",
        variant: "destructive",
      });
    } finally {
      setStep('compose');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Contact {selectedCandidates.length} candidate{selectedCandidates.length !== 1 ? 's' : ''}
          </DialogTitle>
        </DialogHeader>

        {step === 'compose' && (
          <div className="space-y-6">
            <EmailComposer
              templates={emailTemplates || []}
              data={emailData}
              onChange={setEmailData}
              onInsertTag={handleInsertTag}
            />

            <div className="flex items-center space-x-2 pt-4 border-t">
              <Switch
                id="enable-sms"
                checked={enableSms}
                onCheckedChange={setEnableSms}
              />
              <Label htmlFor="enable-sms">Also send SMS</Label>
            </div>

            {enableSms && (
              <SmsComposer
                templates={smsTemplates || []}
                data={smsData}
                onChange={setSmsData}
                onInsertTag={handleInsertTag}
              />
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => setStep('preview')}>
                Preview
              </Button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Email Preview</h3>
              <div className="border p-4 rounded-md">
                <p className="font-medium">Subject: {emailData.subject}</p>
                <div className="mt-2 whitespace-pre-wrap">{emailData.message}</div>
              </div>

              {enableSms && (
                <>
                  <h3 className="font-medium">SMS Preview</h3>
                  <div className="border p-4 rounded-md whitespace-pre-wrap">
                    {smsData.message}
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setStep('compose')}>
                Back
              </Button>
              <Button onClick={handleSend}>
                Send
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
