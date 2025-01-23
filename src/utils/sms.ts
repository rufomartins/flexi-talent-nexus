import { supabase } from "@/integrations/supabase/client";

export type SmsModule = 'onboarding' | 'casting' | 'booking';

interface TwilioCredentials {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

interface SendSmsParams {
  to: string;
  message: string;
  module: SmsModule;
  metadata?: Record<string, unknown>;
}

// Type guard for TwilioCredentials
const isTwilioCredentials = (value: unknown): value is TwilioCredentials => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'accountSid' in (value as any) &&
    'authToken' in (value as any) &&
    'phoneNumber' in (value as any) &&
    typeof (value as any).accountSid === 'string' &&
    typeof (value as any).authToken === 'string' &&
    typeof (value as any).phoneNumber === 'string'
  );
};

export async function getModuleCredentials(module: SmsModule): Promise<TwilioCredentials> {
  const { data: settings, error } = await supabase
    .from('api_settings')
    .select('value')
    .eq('name', `${module}_twilio_credentials`)
    .single();

  if (error) {
    console.error(`Error fetching ${module} Twilio credentials:`, error);
    throw new Error(`Failed to fetch ${module} Twilio credentials`);
  }

  if (!settings?.value || !isTwilioCredentials(settings.value)) {
    throw new Error(`Invalid or missing Twilio credentials for ${module}`);
  }

  return settings.value;
}

export async function sendSMS({ to, message, module, metadata }: SendSmsParams) {
  try {
    const { data, error } = await supabase.functions.invoke('send-sms', {
      body: {
        to,
        message,
        module,
        metadata,
      }
    });

    if (error) throw error;

    // Log the SMS
    const { error: logError } = await supabase
      .from('sms_logs')
      .insert({
        phone_number: to,
        message,
        status: 'sent',
        module,
        metadata,
        sent_at: new Date().toISOString(),
      });

    if (logError) {
      console.error('Error logging SMS:', logError);
    }

    return data;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}