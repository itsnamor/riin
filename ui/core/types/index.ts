export type Theme = "light" | "dark";

export type ProxyStatus = "stopped" | "starting" | "running" | "stopping";

export type Provider = {
  type: "gemini" | "anthropic" | "openai" | "vertex-compat";
  name?: string;
  "api-key"?: string;
  "api-keys"?: Array<{ key: string; "proxy-url"?: string }>;
  "base-url"?: string;
  "proxy-url"?: string;
  headers?: Record<string, string>;
  models?: Array<{ name: string; alias?: string }>;
  "excluded-models"?: string[];
};

export type Config = {
  port: number;
  "auth-dir"?: string;
  "api-keys"?: string[];
  "disable-auth"?: boolean;
  debug?: boolean;
  "logging-to-file"?: boolean;
  "proxy-url"?: string;
  "request-retry"?: number;
  providers?: Provider[];
};

export type Model = {
  created: number;
  id: string;
  object: string;
  owned_by: string;
};

export type Credential = {
  access_token: string;
  disabled: boolean;
  email: string;
  expired: string;
  id_token: string;
  last_refresh: string;
  refresh_token: string;
  type: string;
};

export type CredentialItem = {
  filename: string;
  credential: Credential;
};
