
export interface VideoSettings {
  url: string;
  embed_code: string;
}

export interface CloudMailinSettings {
  enabled: boolean;
  webhook_url?: string;
}

export interface APIConfigs {
  cloudmailin_settings: CloudMailinSettings;
  video_settings: VideoSettings;
}
