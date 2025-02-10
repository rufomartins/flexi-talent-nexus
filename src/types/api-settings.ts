
export interface ResendConfig {
  enabled: boolean;
  api_key: string;
}

export interface TwilioConfig {
  enabled: boolean;
  account_sid: string;
  auth_token: string;
  phone_number: string;
  module: 'onboarding' | 'casting' | 'booking';
}

export interface ForwardEmailConfig {
  enabled: boolean;
  webhook_signature_key: string;
  webhook_domain: string;
  webhook_url: string;
}

export interface CloudinConfig {
  enabled: boolean;
  api_key: string;
  bucket: string;
  region: string;
}

export interface AgoraConfig {
  enabled: boolean;
  app_id: string;
  token_url?: string;
}

export interface APIConfigs {
  resend_settings?: ResendConfig;
  onboarding_twilio_credentials?: TwilioConfig;
  casting_twilio_credentials?: TwilioConfig;
  booking_twilio_credentials?: TwilioConfig;
  forward_email_settings?: ForwardEmailConfig;
  cloudin_settings?: CloudinConfig;
  agora_settings?: AgoraConfig;
}
