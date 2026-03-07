import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { isNil } from "lodash-es";

export type Config = {
  port: number;
  ["api-keys"]: string[];
};

const atomPort = atom<number>();
const atomApiKeys = atom<string[]>();

const atomConfig = atom(
  (get) => ({
    port: get(atomPort),
    ["api-keys"]: get(atomApiKeys),
  }),
  (_get, set, cfg: Partial<Config>) => {
    if (!isNil(cfg.port)) set(atomPort, cfg.port);
    if (!isNil(cfg["api-keys"])) set(atomApiKeys, cfg["api-keys"]);
  },
);

export const useConfigStore = () => useAtom(atomConfig);
export const useConfigValue = () => useAtomValue(atomConfig);
export const useSetConfig = () => useSetAtom(atomConfig);
