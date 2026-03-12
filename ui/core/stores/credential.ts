import { CredentialItem } from "$/core/types";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

const atomCredentialFiles = atom<CredentialItem[]>([]);

export const useCredentialFilesStore = () => useAtom(atomCredentialFiles);
export const useCredentialFilesValue = () => useAtomValue(atomCredentialFiles);
export const useSetCredentialFiles = () => useSetAtom(atomCredentialFiles);
