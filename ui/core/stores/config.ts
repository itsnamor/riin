import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { isNil } from "lodash-es";

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

const atomHost = atom<string>();
const atomPort = atom<number>();
const atomApiKeys = atom<string[]>();
const atomRoutingStrategy = atom<Config["routing"]["strategy"]>("round-robin");

const atomConfig = atom(
  (get) => ({
    host: get(atomHost),
    port: get(atomPort),
    ["api-keys"]: get(atomApiKeys),
    routing: {
      strategy: get(atomRoutingStrategy),
    },
  }),
  (_get, set, cfg: Partial<Config>) => {
    if (!isNil(cfg.host)) set(atomHost, cfg.host);
    if (!isNil(cfg.port)) set(atomPort, cfg.port);
    if (!isNil(cfg["api-keys"])) set(atomApiKeys, cfg["api-keys"]);
    if (!isNil(cfg.routing?.strategy)) set(atomRoutingStrategy, cfg.routing.strategy);
  },
);

export const useConfigStore = () => useAtom(atomConfig);
export const useConfigValue = () => useAtomValue(atomConfig);
export const useSetConfig = () => useSetAtom(atomConfig);
