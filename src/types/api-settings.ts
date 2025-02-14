
export interface VideoSettings {
  url: string;
  embed_code: string;
}

export interface CloudMailinSettings {
  enabled: boolean;
  webhook_url?: string;
}

export interface ResendSettings {
  enabled: boolean;
  api_key?: string;
}

export interface ForwardEmailSettings {
  enabled: boolean;
  webhook_signature_key?: string;
}

export interface APIConfigs {
  cloudmailin_settings: CloudMailinSettings;
  video_settings: VideoSettings;
  resend_settings: ResendSettings;
  forward_email_settings: ForwardEmailSettings;
}
