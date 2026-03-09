import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

type Model = {
  created: number;
  id: string;
  object: string;
  owned_by: string;
};

const atomModels = atom<Model[]>([]);

export const useModelsStore = () => useAtom(atomModels);
export const useModelsValue = () => useAtomValue(atomModels);
export const useSetModels = () => useSetAtom(atomModels);
