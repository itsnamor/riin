import { ProxyStatus } from "$/core/types";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

export const atomProxyStatus = atom<ProxyStatus>("stopped");

export const useProxyStatus = () => useAtom(atomProxyStatus);
export const useProxyStatusValue = () => useAtomValue(atomProxyStatus);
export const useSetProxyStatus = () => useSetAtom(atomProxyStatus);
