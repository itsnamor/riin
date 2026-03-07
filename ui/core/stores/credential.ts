import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

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

const atomCredentialFiles = atom<CredentialItem[]>([]);

export const useCredentialFilesStore = () => useAtom(atomCredentialFiles);
export const useCredentialFilesValue = () => useAtomValue(atomCredentialFiles);
export const useSetCredentialFiles = () => useSetAtom(atomCredentialFiles);
