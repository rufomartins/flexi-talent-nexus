export interface ShareConfig {
  expiresIn: number;  // Hours
  allowComments: boolean;
  readonly: boolean;
}

export interface ShareLinkResponse {
  id: string;
  token: string;
  url: string;
}