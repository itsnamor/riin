export type Theme = "light" | "dark";

export type ProxyStatus = "stopped" | "starting" | "running" | "stopping";

export type Config = {
  host: string;
  port: number;
  ["api-keys"]: string[];
  routing: {
    strategy: "round-robin" | "fill-first";
  };

  "claude-api-key": Array<{
    "api-key": string;
    "base-url"?: string;
    models?: Array<{
      name: string;
      alias: string;
    }>;
  }>;
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
