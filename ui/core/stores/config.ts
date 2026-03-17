import { Config, Provider } from "$/core/types";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { isNil } from "lodash-es";

const atomPort = atom<number>();
const atomAuthDir = atom<string>();
const atomApiKeys = atom<string[]>();
const atomDisableAuth = atom<boolean>();
const atomDebug = atom<boolean>();
const atomLoggingToFile = atom<boolean>();
const atomProxyUrl = atom<string>();
const atomRequestRetry = atom<number>();
const atomProviders = atom<Provider[]>();

const atomConfig = atom(
  (get) => ({
    port: get(atomPort),
    "auth-dir": get(atomAuthDir),
    "api-keys": get(atomApiKeys),
    "disable-auth": get(atomDisableAuth),
    debug: get(atomDebug),
    "logging-to-file": get(atomLoggingToFile),
    "proxy-url": get(atomProxyUrl),
    "request-retry": get(atomRequestRetry),
    providers: get(atomProviders),
  }),
  (_get, set, cfg: Partial<Config>) => {
    if (!isNil(cfg.port)) set(atomPort, cfg.port);
    if (!isNil(cfg["auth-dir"])) set(atomAuthDir, cfg["auth-dir"]);
    if (!isNil(cfg["api-keys"])) set(atomApiKeys, cfg["api-keys"]);
    if (!isNil(cfg["disable-auth"])) set(atomDisableAuth, cfg["disable-auth"]);
    if (!isNil(cfg.debug)) set(atomDebug, cfg.debug);
    if (!isNil(cfg["logging-to-file"])) set(atomLoggingToFile, cfg["logging-to-file"]);
    if (!isNil(cfg["proxy-url"])) set(atomProxyUrl, cfg["proxy-url"]);
    if (!isNil(cfg["request-retry"])) set(atomRequestRetry, cfg["request-retry"]);
    if (!isNil(cfg.providers)) set(atomProviders, cfg.providers);
  },
);

export const useConfigStore = () => useAtom(atomConfig);
export const useConfigValue = () => useAtomValue(atomConfig);
export const useSetConfig = () => useSetAtom(atomConfig);
